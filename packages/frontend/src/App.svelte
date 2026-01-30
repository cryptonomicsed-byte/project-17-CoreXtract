<script lang="ts">
  let status = 'Loading...';

  async function checkAPI() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/status');
      const data = await response.json();
      status = `API Status: ${JSON.stringify(data)}`;
    } catch (e) {
      status = `API Error: ${e}`;
    }
  }

  onMount(() => {
    checkAPI();
  });

  import { onMount } from 'svelte';
</script>

<main class="min-h-screen bg-black text-white p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-4">CoreXtract</h1>
    <p class="text-xl text-gray-400 mb-8">Enterprise-grade brand intelligence platform</p>
    
    <div class="bg-gray-900 border border-red-500 rounded p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Phase 0: Foundation</h2>
      <ul class="text-gray-300 space-y-2">
        <li>✅ Monorepo structure</li>
        <li>✅ CI/CD pipeline</li>
        <li>✅ Docker Compose setup</li>
        <li>✅ Data models (TypeScript)</li>
        <li>⏳ API routes</li>
        <li>⏳ Database migrations</li>
      </ul>
    </div>

    <div class="bg-gray-900 border border-green-500 rounded p-6">
      <h2 class="text-xl font-semibold mb-4">API Status</h2>
      <p class="text-gray-400">{status}</p>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>
