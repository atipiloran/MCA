const axios = require('axios');

const API_URL = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1';

async function fetchReceiptDetails() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt details:', error.message);
    process.exit(1);
  }
}

function groupProductsByOrigin(details) {
  const domesticProducts = [];
  const importedProducts = [];

  details.forEach((item) => {
    if (item.domestic) {
      domesticProducts.push(item);
    } else {
      importedProducts.push(item);
    }
  });

  domesticProducts.sort((a, b) => a.name.localeCompare(b.name));
  importedProducts.sort((a, b) => a.name.localeCompare(b.name));

  return { domesticProducts, importedProducts };
}

function printFinalPrice(products, group) {
  const totalFinalPrice = products.reduce((total, item) => total + item.price, 0);
  console.log(`${group}`);
  products.forEach((item) => {
    console.log(`... ${item.name}`);
    console.log(`Price: $${item.price.toFixed(1)}`);
    if (item.weight) {
      console.log(`Weight: ${item.weight}g`);
    } else {
      console.log(`Weight: N/A`);
    }
  });
}

function printTotalPurchased(products, group) {
  console.log(`${group} cost: $${products.reduce((total, item) => total + item.price, 0).toFixed(1)}`);
  console.log(`${group} count: ${products.length}`);
}

async function main() {
  const receiptDetails = await fetchReceiptDetails();

  const { domesticProducts, importedProducts } = groupProductsByOrigin(receiptDetails);

  printFinalPrice(domesticProducts, 'Domestic');
  printFinalPrice(importedProducts, 'Imported');
  printTotalPurchased(domesticProducts, 'Domestic');
  printTotalPurchased(importedProducts, 'Imported');
}

main();
