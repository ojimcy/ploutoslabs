const WALLETS_KEY = 'WALLETS_KEY';

export const getWalletsFromDb = () => {
  let walletStr = localStorage.getItem(WALLETS_KEY)
  if (!walletStr) walletStr = '[]'
  return JSON.parse(walletStr)
}

export const addWallet = async (wallet) => {
  const wallets = getWalletsFromDb()
  wallets.push(wallet)
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets))
}

export const getWalletByID = (id) => {
  const wallets = getWalletsFromDb()
  for(let i = 0; i < wallets.length; i++) {
    if (wallets[i].id == id) {
      return wallets[i]
    }
  }
  return null
}
