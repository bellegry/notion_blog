import "dotenv/config";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

// 아이디 확인용
// async function testID() {
//   try {
//     const response = await notion.search({
//       filter: {
//         property: "object",
//         value: "database",
//       },
//     });

//     console.log(response.results);
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function testOld() {
//   try {
//     const response = await notion.dataSources.query({
//       data_source_id: process.env.NOTION_DATABASE_ID,
//       page_size: 3,
//     });

//     console.log("결과 개수:", response.results.length);
//     console.log("첫 페이지 ID:", response.results[0]?.id);
//   } catch (error) {
//     console.error("에러:", error.message);
//   }
//   console.log("DB ID:", process.env.NOTION_DATABASE_ID);
// }

const DATA_SOURCE_ID = process.env.NOTION_DATABASE_ID;

const getPlainText = (arr) => arr?.map((t) => t.plain_text).join("") || "";

function normalizeRow(row) {
  const p = row.properties;

  return {
    id: row.id,

    title: getPlainText(p["Post"]?.title),

    slug: p["Target URL"]?.url || null,

    primaryKeyword: getPlainText(p["Primary Keyword"]?.rich_text),

    notes: getPlainText(p["Notes"]?.rich_text),

    publishDate: p["Publish Date"]?.date?.start || null,

    status: p["Status"]?.status?.name || null,

    updatedAt: row.last_edited_time,
  };
}

async function test() {
  try {
    const response = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      page_size: 5,
    });

    const posts = response.results.map(normalizeRow);

    console.log("=== 정규화된 결과 ===");
    console.dir(posts, { depth: null });
  } catch (error) {
    console.error("에러:", error.message);
  }

  // 테이블 정보
  // try {
  //   const response = await notion.search({
  //     filter: {
  //       property: "object",
  //       value: "data_source",
  //     },
  //   });

  //   console.log("접근 가능한 Data Sources:");
  //   response.results.forEach((ds) => {
  //     console.log("이름:", ds.title?.[0]?.plain_text);
  //     console.log("ID:", ds.id);
  //     console.log("=== properties ===");

  //     Object.entries(ds.properties).forEach(([key, value]) => {
  //       console.log("컬럼명:", key);
  //       console.log("타입:", value.type);
  //       console.log("원본:", value);
  //       console.log("-----");
  //     });
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
}

test();
