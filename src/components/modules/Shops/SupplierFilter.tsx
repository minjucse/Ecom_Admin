import { Grid, TextField } from '@mui/material';
import Form from '@/components/ui/useForm';
import Controls from '@/components/controls';
import { supplierFilterSchema } from '@/schemas/shops/supplierFilter.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller } from 'react-hook-form';

export type FilterValues = z.infer<typeof supplierFilterSchema>;

type SupplierFilterProps = {
    defaultValues: FilterValues;
    onSubmit: (data: FilterValues) => void;
};

export default function SupplierFilter({ defaultValues, onSubmit }: SupplierFilterProps) {
    return (
        <Form
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            resolver={zodResolver(supplierFilterSchema)}
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
                                label="Search by name"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                        name="phone"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''} 
                                size="small"
                                label="Phone"
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
