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
  TextInput,
  SimpleGrid,
} from '@mantine/core';
import { useForm } from '@mantine/form';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      'Open Price': 100,
      'Previous Day Close Price': 98,
      'Premarket Volume': 50000,
      'Open Gap %': 2.04,
      'EOD Volume': 1000000,
      'Ticker': 'AAPL',
    },
    validate: {
      'Open Price': (value) => (value > 0 ? null : 'Debe ser mayor que 0'),
      'Previous Day Close Price': (value) => (value > 0 ? null : 'Debe ser mayor que 0'),
      'Premarket Volume': (value) => (value >= 0 ? null : 'No puede ser negativo'),
      'Open Gap %': (value) => (value !== null ? null : 'Campo requerido'),
      'EOD Volume': (value) => (value >= 0 ? null : 'No puede ser negativo'),
      'Ticker': (value) => (value.trim().length > 0 ? null : 'Ticker es requerido'),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const payload = {
      ...values,
      'Open Price': Number(values['Open Price']),
      'Previous Day Close Price': Number(values['Previous Day Close Price']),
      'Premarket Volume': Number(values['Premarket Volume']),
      'Open Gap %': Number(values['Open Gap %']),
      'EOD Volume': Number(values['EOD Volume']),
    };

    try {
      const response = await fetch('http://localhost:4001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error en el servidor');
      }

      setPrediction(data); // Store the whole prediction object
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" style={{ marginTop: '2rem' }}>
      <Title order={1} align="center" mb="lg">
        Advanced Trading Predictor v1
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2} spacing="md">
          <TextInput
            label="Ticker"
            placeholder="Ej: SPY"
            required
            {...form.getInputProps('Ticker')}
          />
          <NumberInput
            label="Open Price"
            placeholder="Ej: 450.75"
            precision={2}
            step={0.1}
            required
            {...form.getInputProps('Open Price')}
          />
          <NumberInput
            label="Previous Day Close Price"
            placeholder="Ej: 449.50"
            precision={2}
            step={0.1}
            required
            {...form.getInputProps('Previous Day Close Price')}
          />
          <NumberInput
            label="Premarket Volume"
            placeholder="Ej: 150000"
            step={1000}
            required
            {...form.getInputProps('Premarket Volume')}
          />
          <NumberInput
            label="EOD Volume"
            placeholder="Ej: 89000000"
            step={10000}
            required
            {...form.getInputProps('EOD Volume')}
          />
          <NumberInput
            label="Open Gap %"
            description="Calculado o manual. Ej: (Open / Prev Close - 1) * 100"
            placeholder="Ej: 0.28"
            precision={4}
            step={0.01}
            required
            {...form.getInputProps('Open Gap %')}
          />
        </SimpleGrid>

        <Group position="center" mt="xl">
          <Button type="submit" loading={loading} size="lg">
            Predict Day Outcome
          </Button>
        </Group>
      </form>

      {loading && (
        <Box mt="lg" style={{ textAlign: 'center' }}>
          <Loader />
          <Text>Running prediction model...</Text>
        </Box>
      )}

      {error && (
        <Alert title="Error" color="red" mt="lg">
          {error}
        </Alert>
      )}

      {prediction && (
        <Box mt="lg" p="md" style={{ backgroundColor: prediction.prediction === 'green' ? '#e6f7ff' : '#fff0f0', borderRadius: '8px', border: `2px solid ${prediction.prediction === 'green' ? '#91d5ff' : '#ffccc7'}` }}>
          <Title order={3} align="center" c={prediction.prediction === 'green' ? 'green' : 'red'}>
            Predicted Outcome: {prediction.prediction.toUpperCase()}
          </Title>
          <Text align="center" size="lg" weight={700} mt="sm">
            Confidence: {(Number(prediction.confidence) * 100).toFixed(2)}%
          </Text>
          <Text size="sm" color="gray" align="center" mt="xs">
            The model predicts a '{prediction.prediction}' day with { (Number(prediction.confidence) * 100).toFixed(2)}% confidence.
          </Text>
        </Box>
      )}
    </Container>
  );
}

export default App;
