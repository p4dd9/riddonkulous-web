import comsetics from '@/app/data/cosmetics.json'

// bg can be either a SKU or a fileName (default random)
export const getCanvasBackground = (bg: string) => {
	const product = comsetics.find((p) => p.sku === bg)
	if (!product) {
		if (bg.includes('.') && bg.includes(bg)) {
			return `/canvas/${bg}`
		}
		return bg
	}
	return `/${product.type}/${product.assetName}`
}
