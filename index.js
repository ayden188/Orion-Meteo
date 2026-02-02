const cryptoId = "solana"; 
const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`;

async function oracle(params) {
  try {
    let repons= await fetch(apiUrl)
    let donnes=await repons.json()
let prix=donnes[cryptoId].usd
console.log(`L'Oracle annonce : le prix du ${cryptoId} est de ${prix} $`);

  } catch (error) {
    
  }
}