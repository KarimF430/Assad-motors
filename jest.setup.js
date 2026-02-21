// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill TransformStream for Next.js 14+ environments
import { TransformStream } from 'stream/web'
global.TransformStream = TransformStream
