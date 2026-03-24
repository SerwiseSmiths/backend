const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '6a28feea84d4aca1ab5c397e60a98e10754931cfb8d1e520df94454cc2bc5a9cc5759d2362e0592af5bcca0e6d3f3fb36e48932e22e853bd5d89e767f08b15540c121f340d22e5f0fa1aee95795a92ee8a74b4fb9abfd60cb8f418d3e3ed8fd3ee8f2a2042feaabb1f6cb45af0a6d37408c5103babefd020c974b0b536bc3c7f';

async function fetchFromStrapi(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${STRAPI_URL}/api${path}`, options);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function seed() {
  const spunId = "fa36t0cqspb6pvmub0tcnwwe"; // Spun Filter
  const filterId = "tc3v1qqfghpmqwgwa8mspq4c"; // Sediment Filter
  const ufId = "qkuojb5q8dqvdg0lj6c38824"; // UF Big Filter
  const tankCleanId = "bh27lwxft173l7a00yirs3wt"; // Basic Check-up (fallback for Tank Clean)

  console.log(`Resolved parts: Spun=${spunId}, Filter=${filterId}, TankClean=${tankCleanId}, UF=${ufId}`);

  // Base mappings
  const mapping6Mo = [
    { usageIndex: 1, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 2, providerCut: 280, parts: [spunId, filterId] },
    { usageIndex: 3, providerCut: 250, parts: [spunId, tankCleanId] }
  ];

  const mapping4Mo = [
    { usageIndex: 1, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 2, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 3, providerCut: 100, parts: [spunId] },
    { usageIndex: 4, providerCut: 150, parts: [tankCleanId] } // simplified 4 visits
  ];

  const mapping3Mo = [
    { usageIndex: 1, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 2, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 3, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 4, providerCut: 280, parts: [filterId, spunId] },
    { usageIndex: 5, providerCut: 150, parts: [tankCleanId] }
  ];

  const plans = [
    // PLAN A
    {
      name: "Plan A 3 Monthly", plan_type: "Basic", totalServices: 5, validityDuration: 12, lockInPeriod: 1965,
      cost: 2250, sub_sales: 3699, non_sub_sales: 4400, sub_profit: 1449, non_sub_profit: 2150,
      serviceMapping: mapping3Mo
    },
    {
      name: "Plan A 4 Monthly", plan_type: "Basic", totalServices: 4, validityDuration: 12, lockInPeriod: 1515,
      cost: 1860, sub_sales: 2799, non_sub_sales: 3300, sub_profit: 939, non_sub_profit: 1440,
      serviceMapping: mapping4Mo
    },
    {
      name: "Plan A 6 Monthly", plan_type: "Basic", totalServices: 3, validityDuration: 12, lockInPeriod: 0,
      cost: 1335, sub_sales: 1999, non_sub_sales: 2200, sub_profit: 664, non_sub_profit: 865,
      serviceMapping: mapping6Mo
    },
    // PLAN B
    {
      name: "Plan B 3 Monthly", plan_type: "Standard", totalServices: 5, validityDuration: 12, lockInPeriod: 2215,
      cost: 2530, sub_sales: 4199, non_sub_sales: 5100, sub_profit: 1669, non_sub_profit: 2570,
      serviceMapping: mapping3Mo
    },
    {
      name: "Plan B 4 Monthly", plan_type: "Standard", totalServices: 4, validityDuration: 12, lockInPeriod: 1765,
      cost: 2140, sub_sales: 3299, non_sub_sales: 4000, sub_profit: 1159, non_sub_profit: 1860,
      serviceMapping: mapping4Mo
    },
    {
      name: "Plan B 6 Monthly", plan_type: "Standard", totalServices: 3, validityDuration: 12, lockInPeriod: 0,
      cost: 1615, sub_sales: 2299, non_sub_sales: 2900, sub_profit: 684, non_sub_profit: 1285,
      serviceMapping: mapping6Mo
    },
    // PLAN C
    {
      name: "Plan C UF Filter Addon", plan_type: "Addon", totalServices: 1, validityDuration: 12, lockInPeriod: 0,
      cost: 120, sub_sales: 350, non_sub_sales: 450, sub_profit: 230, non_sub_profit: 330,
      serviceMapping: [{ usageIndex: 1, providerCut: 100, parts: [ufId] }]
    }
  ];

  console.log("Deleting existing subscriptions...");
  const subs = await fetchFromStrapi('/subscriptions?pagination[limit]=100');
  if (subs.data) {
    for (const sub of subs.data) {
      if (sub && (sub.documentId || sub.id)) {
        await fetchFromStrapi(`/subscriptions/${sub.documentId || sub.id}`, 'DELETE');
        console.log(`Deleted: ${sub.name || 'Unknown'}`);
      }
    }
  }

  console.log("Creating new plans with component mappings...");
  for (const plan of plans) {
    try {
      const res = await fetchFromStrapi('/subscriptions', 'POST', {
        data: { ...plan, publishedAt: new Date() }
      });
      if (res.data) {
        console.log(`Successfully added: ${plan.name}`);
      } else {
        console.error(`Failed to add: ${plan.name}`, JSON.stringify(res.error));
      }
    } catch (e) {
      console.error(`Error adding ${plan.name}:`, e.message);
    }
  }
}

seed();
