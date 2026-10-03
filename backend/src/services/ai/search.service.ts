import { prisma } from '../../config/prisma';

export class AiSearchService {
  static async smartSearch(naturalQuery: string) {
    const queryLower = naturalQuery.toLowerCase();

    // Extract price intent (e.g. "under 80000" or "below 50000")
    let maxPrice: number | undefined = undefined;
    const priceMatch = queryLower.match(/(under|below|less than|max|budget)\s*(?:₹|rs\.?|rupees)?\s*(\d+(?:,\d+)*)/i);
    if (priceMatch && priceMatch[2]) {
      maxPrice = parseInt(priceMatch[2].replace(/,/g, ''), 10);
    }

    // Extract RAM intent (e.g. "16gb ram" or "32gb")
    let ramFilter: string | undefined = undefined;
    const ramMatch = queryLower.match(/(\d+\s*gb)\s*(?:ram)?/i);
    if (ramMatch) {
      ramFilter = ramMatch[1];
    }

    // Keyword tokens (filter out price numbers and stop words)
    const tokens = queryLower
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 2 && isNaN(Number(t)) && !['under', 'below', 'less', 'than', 'max', 'budget', 'show', 'with', 'need', 'for', 'recommend', 'looking', 'suggest'].includes(t));

    const where: any = { active: true };

    if (maxPrice) {
      where.price = { lte: maxPrice };
    }

    if (tokens.length > 0) {
      where.OR = tokens.flatMap((token) => [
        { name: { contains: token } },
        { brand: { contains: token } },
        { description: { contains: token } },
      ]);
    }

    const products = await prisma.product.findMany({
      where,
      take: 12,
      orderBy: { rating: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
    });

    const parsedFilters = {
      detectedMaxPrice: maxPrice || null,
      detectedKeywords: tokens,
      detectedRam: ramFilter || null,
    };

    return {
      query: naturalQuery,
      parsedFilters,
      resultCount: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        stock: p.stock,
        specifications: p.specifications,
        image: (p.images as string[])[0] || '',
        category: p.category.name,
      })),
    };
  }
}
