/**
 * Deployment configuration for TechFeed Hub Frontend
 * 
 * This configuration is designed for AWS S3 + CloudFront deployment
 * but can be adapted for other static hosting providers.
 */

module.exports = {
  // S3 deployment settings
  s3: {
    // Bucket name for static files
    bucketName: process.env.AWS_S3_BUCKET || 'techfeed-hub-frontend',
    
    // AWS region
    region: process.env.AWS_REGION || 'us-east-1',
    
    // S3 bucket policy for static website hosting
    bucketPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::BUCKET_NAME/*'
        }
      ]
    }
  },

  // CloudFront configuration
  cloudfront: {
    // Distribution settings
    priceClass: 'PriceClass_100', // US, Canada, Europe
    
    // Cache behaviors
    cacheBehaviors: {
      // Static assets (JS, CSS, images)
      '*.js': {
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad', // Managed-CachingOptimized
        compress: true,
        ttl: 31536000 // 1 year
      },
      '*.css': {
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
        compress: true,
        ttl: 31536000 // 1 year
      },
      '*.png': {
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
        compress: false,
        ttl: 31536000 // 1 year
      },
      // HTML files
      '*.html': {
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
        compress: true,
        ttl: 3600 // 1 hour
      }
    },

    // Custom error pages for SPA routing
    errorPages: [
      {
        errorCode: 403,
        responseCode: 200,
        responsePage: '/index.html',
        ttl: 300
      },
      {
        errorCode: 404,
        responseCode: 200,
        responsePage: '/index.html',
        ttl: 300
      }
    ]
  },

  // Build settings
  build: {
    // Output directory (Next.js static export)
    outputDir: 'out',
    
    // Files to exclude from deployment
    exclude: [
      '*.map',
      '.DS_Store',
      'Thumbs.db'
    ],
    
    // Gzip compression for additional savings
    gzip: true,
    
    // Brotli compression (if supported by hosting provider)
    brotli: true
  },

  // Environment-specific settings
  environments: {
    development: {
      // Local development server
      baseUrl: 'http://localhost:3000',
      apiUrl: 'http://localhost:8080'
    },
    
    staging: {
      // Staging environment
      baseUrl: 'https://staging.techfeed-hub.com',
      apiUrl: 'https://api-staging.techfeed-hub.com'
    },
    
    production: {
      // Production environment
      baseUrl: 'https://techfeed-hub.com',
      apiUrl: 'https://api.techfeed-hub.com'
    }
  }
}