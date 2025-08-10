import React, { useState } from 'react';
import {
  Container,
  Title,
  NumberInput,
  Button,
  Box,
  Text,
  Loader,
  Alert,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      open_gap_perc: 0.15,
    },
    validate: {
      open_gap_perc: (value) =>
        value > 0 ? null : 'El valor debe ser mayor que 0',
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:4001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          open_gap_perc: Number(values.open_gap_perc),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error en el servidor');
      }

      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" style={{ marginTop: '2rem' }}>
      <Title order={1} align="center" mb="lg">
        Modelo Predictivo de Trading v0
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput
          label="Open Gap %"
          description="Porcentaje de gap en la apertura respecto al cierre anterior."
          placeholder="Ej: 0.15 para un 15%"
          precision={4}
          step={0.01}
          required
          {...form.getInputProps('open_gap_perc')}
        />

        <Group position="center" mt="md">
          <Button type="submit" loading={loading}>
            Predecir Recorrido Máximo (RTH Run %)
          </Button>
        </Group>
      </form>

      {loading && (
        <Box mt="lg" style={{ textAlign: 'center' }}>
          <Loader />
          <Text>Calculando predicción...</Text>
        </Box>
      )}

      {error && (
        <Alert title="Error" color="red" mt="lg">
          {error}
        </Alert>
      )}

      {prediction !== null && (
        <Box mt="lg" p="md" style={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <Text size="lg" weight={700}>
            Predicción para `RTH Run %`:
          </Text>
          <Text size="xl" color="blue">
            {(prediction * 100).toFixed(2)}%
          </Text>
          <Text size="sm" color="gray">
            (El modelo predice que el máximo recorrido desde la apertura será un {(prediction * 100).toFixed(2)}%)
          </Text>
        </Box>
      )}
    </Container>
  );
}

export default App;
