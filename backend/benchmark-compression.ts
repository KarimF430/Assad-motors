
import { gzip } from 'zlib';
import { promisify } from 'util';

const compress = promisify(gzip);

async function benchmark() {
    console.log('🔄 Benchmarking Gzip Compression (CPU vs Size)');
    console.log('---------------------------------------------');

    // Create a realistic payload (e.g., list of car models)
    const item = {
        id: "model-123",
        name: "Mahindra XUV700",
        variant: "AX7 Luxury Pack Diesel AT AWD",
        specs: {
            engine: "2184 cc",
            power: "182 bhp",
            torque: "450 Nm",
            features: ["ADAS", "Sunroof", "360 Camera", "Ventilated Seats", "7 Airbags"]
        },
        description: "The Mahindra XUV700 is a premium SUV that offers best-in-class features and performance."
    };

    // Multiply to simulate a large list (e.g., fetching all variants)
    const largeDataset = Array.from({ length: 500 }, (_, i) => ({ ...item, id: `model-${i}` }));
    const jsonStr = JSON.stringify(largeDataset);

    const originalSize = Buffer.byteLength(jsonStr);
    console.log(`📦 Original Size: ${(originalSize / 1024).toFixed(2)} KB`);

    // Measure Compression
    const start = performance.now();
    const compressed = await compress(Buffer.from(jsonStr));
    const end = performance.now();

    const compressedSize = compressed.length;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    const timeTaken = (end - start).toFixed(3);

    console.log(`📦 Compressed Size: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`📉 Size Reduction: ${reduction}%`);
    console.log(`⏱️  CPU Time Taken: ${timeTaken} ms`);
    console.log('---------------------------------------------');

    // Analysis
    console.log('💡 Analysis:');
    console.log(`   You saved ${((originalSize - compressedSize) / 1024).toFixed(2)} KB of data transfer.`);
    console.log(`   It cost ${timeTaken} ms of CPU time.`);

    // Estimate Network Time (Assuming standard 4G/Broadband ~ 10-50Mbps effective for single request latency + transfer)
    // 300KB transfer approx times:
    // 50 Mbps = ~48ms
    // 5 Mbps = ~480ms
    // Compressed (50KB):
    // 50 Mbps = ~8ms
    // 5 Mbps = ~80ms

    console.log(`   Estimated Network Time Saving (at 50Mbps): ~${((originalSize - compressedSize) * 8 / (50 * 1024 * 1024) * 1000).toFixed(1)} ms`);

}

benchmark();
