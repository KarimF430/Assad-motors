const { z } = require('zod');

// Define the schema directly here for testing
const insertBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logo: z.string().optional(),
  status: z.string().default("active"),
  summary: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).default([])
});

// Test data
const testData = {
  name: "Honda",
  status: "active",
  summary: "Honda is a Japanese automotive manufacturer known for reliability and innovation.",
  faqs: [
    {
      question: "What are the upcoming cars from Honda?",
      answer: "Honda is expected to launch Honda WR-V and Honda Odyssey."
    }
  ]
};

console.log('🧪 Testing validation...');
console.log('📄 Test data:', JSON.stringify(testData, null, 2));

try {
  const validatedData = insertBrandSchema.parse(testData);
  console.log('✅ Validation passed!');
  console.log('📋 Validated data:', JSON.stringify(validatedData, null, 2));
} catch (error) {
  console.error('❌ Validation failed:', error);
  if (error.errors) {
    console.error('📋 Validation errors:', error.errors);
  }
}
