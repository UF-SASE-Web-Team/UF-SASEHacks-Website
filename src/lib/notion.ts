import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

type NotionRichTextSegment = {
  plain_text: string;
  href?: string;
};

function extractRichText(richTextArray: NotionRichTextSegment[]): string {
  if (!richTextArray || !Array.isArray(richTextArray)) return "";

  return richTextArray.map((segment) => {
    if (segment.href) {
      // If there's a link, convert it to markdown format
      return `[${segment.plain_text}](${segment.href})`;
    }
    return segment.plain_text || "";
  }).join("");
}

export async function fetchFaqFromNotion(): Promise<FaqItem[]> {
  try {
    if (!process.env.NOTION_DB_ID) {
      console.warn("NOTION_DB_ID not set, returning empty FAQ");
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
      filter: {
        property: "published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "order", direction: "ascending" }],
    });

    return response.results.map((page) => {
      const pageData = page as {
        id: string;
        properties: {
          question?: { title?: Array<{ plain_text: string }> };
          answer?: { rich_text?: NotionRichTextSegment[] };
          order?: { number?: number };
        };
      };

      return {
        id: pageData.id,
        question: pageData.properties.question?.title?.[0]?.plain_text ?? "",
        answer: extractRichText(pageData.properties.answer?.rich_text ?? []) || "",
        order: pageData.properties.order?.number ?? 999,
      };
    });
  } catch (error) {
    console.error("Error fetching FAQ from Notion:", error);
    return [];
  }
}
