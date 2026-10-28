import { test, expect } from '@playwright/test';

/**
 * API Testing with Playwright
 * CRITICAL SDET Interview Topic
 * Test REST APIs directly without UI
 */

test.describe('GET Requests', () => {

  test('Simple GET request', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    // Verify status code
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse JSON response
    const data = await response.json();
    console.log('Response data:', data);

    // Verify response data
    expect(data.id).toBe(1);
    expect(data.userId).toBe(1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
  });

  test('GET request with query parameters', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        userId: 1
      }
    });

    expect(response.status()).toBe(200);

    const posts = await response.json();
    console.log('Number of posts:', posts.length);

    // Verify all posts belong to userId 1
    posts.forEach((post: any) => {
      expect(post.userId).toBe(1);
    });
  });

  test('GET request with headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Playwright-Test'
      }
    });

    expect(response.ok()).toBeTruthy();

    // Check response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    console.log('Response headers:', response.headers());
  });
});

test.describe('POST Requests', () => {

  test('Create new resource with POST', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Test Post',
        body: 'This is a test post created by Playwright',
        userId: 1
      }
    });

    expect(response.status()).toBe(201); // Created
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('Created post:', data);

    expect(data.title).toBe('Test Post');
    expect(data.userId).toBe(1);
    expect(data).toHaveProperty('id');
  });

  test('POST with headers', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token'
      },
      data: {
        title: 'Authenticated Post',
        body: 'Post with auth header',
        userId: 2
      }
    });

    expect(response.status()).toBe(201);
  });
});

test.describe('PUT Requests', () => {

  test('Update resource with PUT', async ({ request }) => {
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
      data: {
        id: 1,
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Updated post:', data);

    expect(data.title).toBe('Updated Title');
    expect(data.body).toBe('Updated body content');
  });
});

test.describe('PATCH Requests', () => {

  test('Partial update with PATCH', async ({ request }) => {
    const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
      data: {
        title: 'Patched Title Only'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Patched post:', data);

    expect(data.title).toBe('Patched Title Only');
    expect(data).toHaveProperty('body'); // Other fields remain
  });
});

test.describe('DELETE Requests', () => {

  test('Delete resource', async ({ request }) => {
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);
    console.log('Resource deleted successfully');
  });
});

test.describe('Response Validation', () => {

  test('Validate response schema', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

    expect(response.ok()).toBeTruthy();

    const user = await response.json();

    // Validate response structure
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('address');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');

    // Validate data types
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');

    console.log('Response schema validated');
  });

  test('Validate array response', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');

    expect(response.ok()).toBeTruthy();

    const posts = await response.json();

    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);

    // Validate first item structure
    expect(posts[0]).toHaveProperty('userId');
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
  });
});

test.describe('Error Handling', () => {

  test('Handle 404 Not Found', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/9999');

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();

    console.log('Handled 404 error correctly');
  });

  test('Validate error responses', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/invalid-endpoint');

    expect(response.status()).toBe(404);

    console.log('Error status:', response.status());
    console.log('Error status text:', response.statusText());
  });
});

test.describe('API Testing Best Practices', () => {

  test('Complete CRUD workflow', async ({ request }) => {
    // CREATE
    const createResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Workflow Test',
        body: 'Testing CRUD operations',
        userId: 1
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPost = await createResponse.json();
    const postId = createdPost.id;
    console.log('Created post ID:', postId);

    // READ
    const readResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    expect(readResponse.ok()).toBeTruthy();
    const readPost = await readResponse.json();
    expect(readPost.id).toBe(postId);
    console.log('Read post:', readPost.title);

    // UPDATE
    const updateResponse = await request.put(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      data: {
        id: postId,
        title: 'Updated Workflow Test',
        body: 'Updated content',
        userId: 1
      }
    });
    expect(updateResponse.ok()).toBeTruthy();
    console.log('Updated post');

    // DELETE
    const deleteResponse = await request.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    expect(deleteResponse.ok()).toBeTruthy();
    console.log('Deleted post');

    console.log('✅ Complete CRUD workflow tested successfully');
  });

  test('Performance - Response time check', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get('https://jsonplaceholder.typicode.com/posts');

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.ok()).toBeTruthy();
    console.log(`Response time: ${responseTime}ms`);

    // Assert response time is under 2 seconds
    expect(responseTime).toBeLessThan(2000);
  });
});

test.describe('Authentication', () => {

  test('API with Bearer token', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });

    expect(response.ok()).toBeTruthy();
    console.log('Request with Bearer token successful');
  });

  test('API with Basic Auth', async ({ request }) => {
    // Example with Basic Auth (username:password encoded in base64)
    const credentials = Buffer.from('username:password').toString('base64');

    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    expect(response.ok()).toBeTruthy();
  });
});
