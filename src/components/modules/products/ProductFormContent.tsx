import { useEffect, useState } from "react";
import { 
    Box, 
    Grid, 
    Button, 
    Typography, 
    Divider, 
    IconButton, 
    Checkbox, 
    FormControlLabel, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Select, 
    MenuItem, 
    InputLabel, 
    FormControl,
    Card,
    CardContent,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    Chip,
    Alert
} from "@mui/material";
import { 
    Delete as DeleteIcon, 
    Refresh as RefreshIcon,
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { toast } from "sonner";
import { useFieldArray, useFormContext } from "react-hook-form";

import Controls from "@/components/controls";
import { ProductDetailFormValues } from "@/schemas/products/productsManagement.schema";

interface ProductFormContentProps {
    brands: any;
    categories: any;
    units: any;
    attributes: any;
    fetchSubCategories: (categoryId: string) => void;
    subCategories: any;
    fetchAttributeValues: any;
    generateBarcode: () => string;
}

const ProductFormContent = ({
    brands,
    categories,
    units,
    attributes,
    fetchSubCategories,
    subCategories,
    fetchAttributeValues,
    generateBarcode,
}: ProductFormContentProps) => {
    const { control, setValue, watch } = useFormContext<ProductDetailFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "productAttributes",
    });

    const [prevCategoryId, setPrevCategoryId] = useState<string>(watch("categoryId"));
    const currentCategoryId = watch("categoryId");

    // Dynamic Attribute Logic
    const [activeGroupIds, setActiveGroupIds] = useState<string[]>([]);
    const [groupValuesMap, setGroupValuesMap] = useState<Record<string, { id: string; name: string }[]>>({});
    const [newVariantSelections, setNewVariantSelections] = useState<Record<string, string>>({});
    const [newVariantStock, setNewVariantStock] = useState({ qty: 0, min: 0, barcode: generateBarcode() });
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [loadingGroups, setLoadingGroups] = useState<Set<string>>(new Set());

    // 1. SubCategory Logic
    useEffect(() => {
        if (currentCategoryId) {
            fetchSubCategories(currentCategoryId);
        }
        if (prevCategoryId !== currentCategoryId) {
            setValue("subCategoryId", "");
            setPrevCategoryId(currentCategoryId);
        }
    }, [currentCategoryId, prevCategoryId, fetchSubCategories, setValue]);

    // 2. Initialize Active Groups from Existing Data (Edit Mode)
    useEffect(() => {
        if (fields.length > 0 && activeGroupIds.length === 0 && attributes?.data) {
            const detectedIds = new Set<string>();
            fields.forEach((field: any) => {
                field.attributes?.forEach((attr: any) => {
                    if (attr.attributeGroupId) {
                        detectedIds.add(String(attr.attributeGroupId));
                    } else if (attr.attributeGroupName) {
                        const group = attributes.data.find((g: any) => g.name === attr.attributeGroupName);
                        if (group) {
                            const groupId = group.id || group._id;
                            detectedIds.add(String(groupId));
                        }
                    }
                });
            });
            if (detectedIds.size > 0) {
                setActiveGroupIds(Array.from(detectedIds));
            }
        }
    }, [fields, attributes, activeGroupIds.length]);

    // 3. Fetch Values for Active Groups
    useEffect(() => {
        activeGroupIds.forEach((groupId) => {
            if (groupValuesMap[groupId] || loadingGroups.has(groupId)) {
                return;
            }

            setLoadingGroups(prev => new Set(prev).add(groupId));

            fetchAttributeValues(groupId)
                .unwrap()
                .then((res: any) => {
                    const data = Array.isArray(res.data) ? res.data.map((item: any) => ({
                        id: String(item.id || item._id),
                        name: item.name
                    })) : [];
                    
                    setGroupValuesMap(prev => ({ ...prev, [groupId]: data }));
                    setLoadingGroups(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(groupId);
                        return newSet;
                    });
                })
                .catch((err: any) => {
                    console.error("Failed to fetch values for group", groupId, err);
                    setLoadingGroups(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(groupId);
                        return newSet;
                    });
                    toast.error(`Failed to load values for ${getGroupName(groupId)}`);
                });
        });

        // Clean up deactivated groups
        Object.keys(groupValuesMap).forEach(groupId => {
            if (!activeGroupIds.includes(groupId)) {
                setGroupValuesMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[groupId];
                    return newMap;
                });
                setNewVariantSelections(prev => {
                    const newSelections = { ...prev };
                    delete newSelections[groupId];
                    return newSelections;
                });
            }
        });
    }, [activeGroupIds]);

    const handleGroupToggle = (groupId: string) => {
        setActiveGroupIds(prev => {
            const isActive = prev.includes(groupId);
            return isActive ? prev.filter(id => id !== groupId) : [...prev, groupId];
        });
    };

    const handleVariantSelectionChange = (groupId: string, valueId: string) => {
        setNewVariantSelections(prev => ({ ...prev, [groupId]: valueId }));
    };

    const getVariantDisplayName = (attributes: any[]) => {
        return attributes
            .map(attr => attr.attributeValueName)
            .join(' / ');
    };

    const handleAddVariant = () => {
        const missingSelection = activeGroupIds.some(groupId => !newVariantSelections[groupId]);
        if (missingSelection) {
            toast.warning("Please select a value for all active attribute groups.");
            return;
        }

        const attributesList = activeGroupIds.map(groupId => {
            const valueId = newVariantSelections[groupId];
            const valueObj = groupValuesMap[groupId]?.find(v => v.id === valueId);
            const groupObj = attributes?.data?.find((g: any) => {
                const gId = g.id || g._id;
                return String(gId) === groupId;
            });

            return {
                attributeValueId: valueId,
                attributeValueName: valueObj?.name || "",
                attributeGroupId: groupId,
                attributeGroupName: groupObj?.name || ""
            };
        });

        // Check duplicates
        const isDuplicate = fields.some((field: any) => {
            if (field.attributes.length !== attributesList.length) return false;
            return attributesList.every(newAttr =>
                field.attributes.some((existingAttr: any) => 
                    existingAttr.attributeValueId === newAttr.attributeValueId
                )
            );
        });

        if (isDuplicate) {
            toast.warning("This variant combination already exists.");
            return;
        }

        append({
            attributes: attributesList,
            barCode: newVariantStock.barcode || generateBarcode(),
            startingInventory: newVariantStock.qty,
            minimumStockToNotify: newVariantStock.min
        });

        setNewVariantStock({ 
            qty: 0, 
            min: 0, 
            barcode: generateBarcode() 
        });
        toast.success(`Variant "${getVariantDisplayName(attributesList)}" added successfully`);
    };

    const getGroupName = (id: string) => {
        const group = attributes?.data?.find((g: any) => {
            const groupId = g.id || g._id;
            return String(groupId) === id;
        });
        return group?.name || "Attribute";
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                {/* Basic Info */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Basic Information
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controls.Input name="name" label="Product Name" type="text" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controls.Select name="brandId" label="Brand" options={brands?.data || []} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controls.Select name="categoryId" label="Category" options={categories?.data || []} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controls.Select
                        name="subCategoryId"
                        label="Sub Category"
                        options={subCategories?.data || []}
                        disabled={!currentCategoryId}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controls.Select name="measurementUnitId" label="Measurement Unit" options={units?.data || []} />
                </Grid>

                {/* Pricing & Inventory */}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Pricing & Inventory
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}><Controls.Input name="productCode" label="Product Code" type="text" /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Controls.Input name="productSku" label="SKU" type="text" /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Controls.Input name="price" label="Base Price" type="number" required /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Controls.Input name="vatRate" label="VAT %" type="number" /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Controls.Input name="startingInventory" label="Stock" type="number" /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Controls.Input name="minimumStockToNotify" label="Alert Level" type="number" /></Grid>

                {/* Product Variants Section */}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Product Variants
                        </Typography>
                        {fields.length > 0 && (
                            <Chip 
                                label={`${fields.length} variant${fields.length > 1 ? 's' : ''}`} 
                                color="primary" 
                                size="small"
                                icon={<CheckCircleIcon />}
                            />
                        )}
                    </Box>

                    {/* Info Alert */}
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Create product variants by selecting attribute combinations (e.g., Size: L, Color: Blue = "L / Blue")
                    </Alert>

                    {/* 1. Attribute Selection */}
                    <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                Step 1: Select Attribute Groups
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {attributes?.data?.map((group: any) => {
                                    const groupId = String(group.id || group._id);
                                    const isChecked = activeGroupIds.includes(groupId);
                                    
                                    return (
                                        <FormControlLabel
                                            key={groupId}
                                            control={
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={() => handleGroupToggle(groupId)}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Typography sx={{ fontWeight: isChecked ? 600 : 400 }}>
                                                    {group.name}
                                                </Typography>
                                            }
                                        />
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 2. Variant Generator */}
                    {activeGroupIds.length > 0 && (
                        <Card sx={{ mb: 3, bgcolor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Step 2: Create Variant Combination
                                </Typography>
                                <Grid container spacing={2} alignItems="flex-end">
                                    {activeGroupIds.map((groupId) => {
                                        const values = groupValuesMap[groupId] || [];
                                        const isLoading = loadingGroups.has(groupId);
                                        
                                        return (
                                            <Grid key={groupId} size={{ xs: 12, sm: 6, md: activeGroupIds.length > 2 ? 3 : 4 }}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>{getGroupName(groupId)}</InputLabel>
                                                    <Select
                                                        value={newVariantSelections[groupId] || ""}
                                                        label={getGroupName(groupId)}
                                                        onChange={(e) => handleVariantSelectionChange(groupId, e.target.value)}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <MenuItem value="">Loading...</MenuItem>
                                                        ) : values.length === 0 ? (
                                                            <MenuItem value="">No values available</MenuItem>
                                                        ) : (
                                                            values.map((val) => (
                                                                <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        );
                                    })}

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Barcode"
                                            value={newVariantStock.barcode}
                                            onChange={(e) => setNewVariantStock({ ...newVariantStock, barcode: e.target.value })}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => setNewVariantStock({ ...newVariantStock, barcode: generateBarcode() })}
                                                            title="Generate new barcode"
                                                        >
                                                            <RefreshIcon fontSize="small" />
                                                        </IconButton>
                                                    )
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Quantity"
                                            type="number"
                                            value={newVariantStock.qty}
                                            onChange={(e) => setNewVariantStock({ ...newVariantStock, qty: Number(e.target.value) })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Min Alert"
                                            type="number"
                                            value={newVariantStock.min}
                                            onChange={(e) => setNewVariantStock({ ...newVariantStock, min: Number(e.target.value) })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            onClick={handleAddVariant} 
                                            fullWidth 
                                            sx={{ height: '40px' }}
                                        >
                                            Add Variant
                                        </Button>
                                    </Grid>
                                </Grid>

                                {/* Preview Selected Combination */}
                                {Object.keys(newVariantSelections).length > 0 && (
                                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'white', borderRadius: 1, border: '1px solid #dee2e6' }}>
                                        <Typography variant="caption" color="text.secondary">Preview:</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                            {activeGroupIds
                                                .filter(gId => newVariantSelections[gId])
                                                .map(gId => {
                                                    const val = groupValuesMap[gId]?.find(v => v.id === newVariantSelections[gId]);
                                                    return val?.name;
                                                })
                                                .join(' / ') || 'Select all attributes...'}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* 3. Variants Display */}
                    {fields.length > 0 && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Created Variants ({fields.length})
                                </Typography>
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                                    size="small"
                                >
                                    <ToggleButton value="cards">
                                        <ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} />
                                        Cards
                                    </ToggleButton>
                                    <ToggleButton value="table">
                                        <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} />
                                        Table
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {/* Card View */}
                            {viewMode === 'cards' && (
                                <Grid container spacing={2}>
                                    {fields.map((field: any, index: number) => {
                                        const variantName = getVariantDisplayName(field.attributes);
                                        
                                        return (
                                            <Grid key={field.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                                <Card sx={{ height: '100%', border: '1px solid #e0e0e0', '&:hover': { boxShadow: 3 } }}>
                                                    <CardContent>
                                                        {/* Variant Title */}
                                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                                                            {variantName}
                                                        </Typography>

                                                        {/* Attributes */}
                                                        <Box sx={{ mb: 2 }}>
                                                            {field.attributes?.map((attr: any) => (
                                                                <Box 
                                                                    key={attr.attributeGroupId}
                                                                    sx={{ 
                                                                        display: 'flex', 
                                                                        justifyContent: 'space-between',
                                                                        py: 1,
                                                                        borderBottom: '1px solid #f0f0f0'
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {attr.attributeGroupName}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                        {attr.attributeValueName}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                        <Divider sx={{ my: 1.5 }} />

                                                        {/* Stock Info */}
                                                        <Grid container spacing={1} sx={{ mb: 1.5 }}>
                                                            <Grid size={{ xs: 6 }}>
                                                                <Box sx={{ bgcolor: '#e3f2fd', borderRadius: 1, p: 1.5, textAlign: 'center' }}>
                                                                    <Typography variant="caption" color="text.secondary">Stock</Typography>
                                                                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                                        {watch(`productAttributes.${index}.startingInventory`) || 0}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid size={{ xs: 6 }}>
                                                                <Box sx={{ bgcolor: '#fff3e0', borderRadius: 1, p: 1.5, textAlign: 'center' }}>
                                                                    <Typography variant="caption" color="text.secondary">Min Alert</Typography>
                                                                    <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 600 }}>
                                                                        {watch(`productAttributes.${index}.minimumStockToNotify`) || 0}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Barcode */}
                                                        <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 1.5, mb: 1.5 }}>
                                                            <Typography variant="caption" color="text.secondary">Barcode</Typography>
                                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                                {watch(`productAttributes.${index}.barCode`) || 'N/A'}
                                                            </Typography>
                                                        </Box>

                                                        {/* Actions */}
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<EditIcon />}
                                                                fullWidth
                                                                onClick={() => setViewMode('table')}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <IconButton 
                                                                color="error" 
                                                                size="small"
                                                                onClick={() => {
                                                                    if (window.confirm(`Delete variant "${variantName}"?`)) {
                                                                        remove(index);
                                                                        toast.success('Variant deleted');
                                                                    }
                                                                }}
                                                                sx={{ border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}

                            {/* Table View */}
                            {viewMode === 'table' && (
                                <Box sx={{ overflowX: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Variant</TableCell>
                                                {activeGroupIds.map(groupId => (
                                                    <TableCell key={groupId} sx={{ fontWeight: 'bold' }}>
                                                        {getGroupName(groupId)}
                                                    </TableCell>
                                                ))}
                                                <TableCell sx={{ fontWeight: 'bold' }}>Barcode</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Min</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((field: any, index: number) => (
                                                <TableRow key={field.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {getVariantDisplayName(field.attributes)}
                                                        </Typography>
                                                    </TableCell>
                                                    {activeGroupIds.map(groupId => {
                                                        const attr = field.attributes?.find((a: any) => a.attributeGroupId === groupId);
                                                        return (
                                                            <TableCell key={groupId}>
                                                                <Chip 
                                                                    label={attr?.attributeValueName || "-"} 
                                                                    size="small" 
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell>
                                                        <Controls.Input name={`productAttributes.${index}.barCode`} label="" type="text" />
                                                    </TableCell>
                                                    <TableCell sx={{ width: '120px' }}>
                                                        <Controls.Input name={`productAttributes.${index}.startingInventory`} label="" type="number" />
                                                    </TableCell>
                                                    <TableCell sx={{ width: '120px' }}>
                                                        <Controls.Input name={`productAttributes.${index}.minimumStockToNotify`} label="" type="number" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton 
                                                            color="error" 
                                                            size="small" 
                                                            onClick={() => {
                                                                if (window.confirm('Delete this variant?')) {
                                                                    remove(index);
                                                                    toast.success('Variant deleted');
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            )}
                        </>
                    )}
                </Grid>

                {/* Submit Button */}
                <Grid size={{ xs: 12 }} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            minWidth: 300,
                            borderRadius: 28,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: "#ffffff",
                            backgroundColor: "#FF9A01",
                            "&:hover": { backgroundColor: "#e88c00" },
                        }}
                    >
                        Save Product
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductFormContent;