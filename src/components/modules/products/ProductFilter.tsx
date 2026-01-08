import { Grid, TextField } from '@mui/material';
import Form from '@/components/ui/useForm';
import Controls from '@/components/controls';
import { productFilterSchema } from '@/schemas/products/productFilter.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller } from 'react-hook-form';

export type FilterValues = z.infer<typeof productFilterSchema>;

type ProductFilterProps = {
    defaultValues: FilterValues;
    onSubmit: (data: FilterValues) => void;
};

export default function ProductFilter({ defaultValues, onSubmit }: ProductFilterProps) {
    return (
        <Form
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            resolver={zodResolver(productFilterSchema)}
            resetOnDefaultChange={true}
        >
            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Controller
                        name="keyword"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''} 
                                size="small"
                                label="Search by product name"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                        name="productCode"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''} 
                                size="small"
                                label="Product Code"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controls.Button type="submit" text="Apply Filter" />
                </Grid>
            </Grid>
        </Form>
    );
}
