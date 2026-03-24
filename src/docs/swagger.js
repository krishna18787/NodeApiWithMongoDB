const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'NPM Server API',
    version: '1.0.0',
    description:
      'API documentation for authentication, tasks, profile image upload, and system endpoints.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    { name: 'System', description: 'Basic health and utility endpoints' },
    { name: 'Auth', description: 'Authentication and JWT token endpoints' },
    { name: 'Tasks', description: 'Task CRUD endpoints' },
    { name: 'Profile', description: 'Profile image upload and retrieval' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'invalid email or password',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
          database: {
            type: 'string',
            example: 'connected',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '65f1f0c2e13b2d0012345678',
          },
          name: {
            type: 'string',
            example: 'Krishna',
          },
          email: {
            type: 'string',
            example: 'krishna@example.com',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'login successful',
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            example: 'Krishna',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'krishna@example.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'secret123',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'krishna@example.com',
          },
          password: {
            type: 'string',
            example: 'secret123',
          },
        },
      },
      Task: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '65f1f0c2e13b2d0012345678',
          },
          title: {
            type: 'string',
            example: 'Learn Swagger',
          },
          description: {
            type: 'string',
            example: 'Add API documentation',
          },
          completed: {
            type: 'boolean',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
          __v: {
            type: 'integer',
            example: 0,
          },
        },
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            example: 'Finish login page',
          },
          description: {
            type: 'string',
            example: 'Add redirect to task page',
          },
          completed: {
            type: 'boolean',
            example: false,
          },
        },
      },
      UpdateTaskRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'Finish login page',
          },
          description: {
            type: 'string',
            example: 'Add redirect to task page',
          },
          completed: {
            type: 'boolean',
            example: true,
          },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '65f1f0c2e13b2d0012345678',
          },
          name: {
            type: 'string',
            example: 'Krishna',
          },
          imageUrl: {
            type: 'string',
            example: '/uploads/profiles/1773832779663-231746094.png',
          },
          imageFilename: {
            type: 'string',
            example: '1773832779663-231746094.png',
          },
          imageMimeType: {
            type: 'string',
            example: 'image/png',
          },
          imageSize: {
            type: 'integer',
            example: 67,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
          __v: {
            type: 'integer',
            example: 0,
          },
        },
      },
    },
  },
  paths: {
    '/api/hello': {
      get: {
        tags: ['System'],
        summary: 'Get hello message',
        responses: {
          200: {
            description: 'Hello response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Hello, world!',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/echo': {
      post: {
        tags: ['System'],
        summary: 'Echo request body',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: true,
                example: {
                  name: 'Alice',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Echoed body',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    received: {
                      type: 'object',
                      additionalProperties: true,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Body missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Get API health status',
        responses: {
          200: {
            description: 'Health response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          409: {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user from JWT token',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all tasks',
        responses: {
          200: {
            description: 'Task list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTaskRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Task created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get task by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Task found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          400: {
            description: 'Invalid id',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Update task by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTaskRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Task updated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete task by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Task deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'task deleted',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid id',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Get latest uploaded profile',
        responses: {
          200: {
            description: 'Profile found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Profile',
                },
              },
            },
          },
          404: {
            description: 'Profile not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Profile'],
        summary: 'Upload or replace profile image',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'Krishna',
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Profile',
                },
              },
            },
          },
          201: {
            description: 'Profile created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Profile',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};

function registerSwagger(app) {
  app.get('/api-docs.json', (req, res) => {
    const host = req.get('host');
    const protocol = req.protocol;

    res.json({
      ...swaggerDocument,
      servers: [
        {
          url: `${protocol}://${host}`,
          description: 'Current server',
        },
      ],
    });
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerOptions: {
        url: '/api-docs.json',
      },
      customSiteTitle: 'NPM Server API Docs',
    })
  );
}

module.exports = registerSwagger;
