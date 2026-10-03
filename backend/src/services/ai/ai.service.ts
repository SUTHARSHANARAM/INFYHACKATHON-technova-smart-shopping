import { prisma } from '../../config/prisma';
import { AiRecommendationService } from './recommendation.service';
import { AiSearchService } from './search.service';

export class AiService {
  static async chat(prompt: string, conversationHistory?: any[]) {
    const promptLower = prompt.toLowerCase();

    // Check if intent matches recommendation / search
    if (
      promptLower.includes('recommend') ||
      promptLower.includes('looking for') ||
      promptLower.includes('under') ||
      promptLower.includes('suggest') ||
      promptLower.includes('laptop') ||
      promptLower.includes('phone') ||
      promptLower.includes('headphone') ||
      promptLower.includes('anc') ||
      promptLower.includes('audio') ||
      promptLower.includes('earbud') ||
      promptLower.includes('monitor') ||
      promptLower.includes('keyboard') ||
      promptLower.includes('mouse') ||
      promptLower.includes('show') ||
      promptLower.includes('best')
    ) {
      const searchResult = await AiSearchService.smartSearch(prompt);
      if (searchResult.products.length > 0) {
        const topProduct = searchResult.products[0];
        const responseText = `Here is what I found in TechNova's live store catalog for "${prompt}":\n\nI highly recommend **${topProduct.name}** by ${topProduct.brand} priced at **₹${topProduct.price.toLocaleString('en-IN')}** (${topProduct.rating}⭐ rating). It matches your criteria and is currently in stock.`;

        return {
          response: responseText,
          products: searchResult.products.slice(0, 4),
          groundedDataUsed: true,
        };
      }
    }

    // Default grounded query
    const totalCount = await prisma.product.count({ where: { active: true } });
    const featured = await prisma.product.findMany({
      where: { featured: true, active: true },
      take: 3,
      select: { id: true, name: true, price: true, brand: true, rating: true, images: true },
    });

    const formattedFeatured = featured.map((f) => ({
      ...f,
      image: (f.images as string[])[0] || '',
    }));

    return {
      response: `Welcome to TechNova AI Assistant! We have ${totalCount} premium electronics products available. How can I help you find the right smartphone, laptop, audio gear, or computer accessories today?`,
      products: formattedFeatured,
      groundedDataUsed: true,
    };
  }
}
