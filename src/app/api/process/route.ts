// pages/api/roast.ts - API Route untuk mengintegrasikan dengan AI
import { ai } from "@/utils/gemini";
import { NextRequest, NextResponse } from "next/server";

interface RoastRequest {
  linkedinUrl?: string;
  githubUrl?: string;
  cvText?: string;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const linkedinUrl = formData.get("linkedinUrl") as string | null;
    const githubUrl = formData.get("githubUrl") as string | null;
    const cvFile = formData.get("cv") as File | null;
    

    let cvText = "";
    if (cvFile) {
      try {
        const arrayBuffer = await cvFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        cvText = pdfData.text;
        
      } catch (error) {
        console.error("Error parsing PDF:", error);
        return NextResponse.json(
          { message: "Error parsing PDF file" },
          { status: 400 }
        );
      }
    }

    if (!linkedinUrl && !githubUrl && !cvText) {
      return NextResponse.json(
        {
          message: "Setidaknya satu data harus diisi (LinkedIn, GitHub, atau CV)",
        },
        { status: 400 }
      );
    }
    
    const cleanLinkedinUrl = linkedinUrl || undefined;
    const cleanGithubUrl = githubUrl || undefined;

    let profileData = "";

    if (linkedinUrl && cleanLinkedinUrl) {
      profileData += `LinkedIn Profile: ${cleanLinkedinUrl}\n`;
    }

    if (githubUrl && cleanGithubUrl) {
      const githubData = await fetchGitHubProfile(cleanGithubUrl);
      profileData += `GitHub Data: ${githubData}\n`;
    }

    if (cvText) {
      profileData += `CV Content: ${cvText}\n`;
    }

    const roastResult = await generateRoast(profileData);

    return NextResponse.json({ data: roastResult });
  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat roasting" },
      { status: 500 }
    );
  }
}

async function fetchGitHubProfile(githubUrl: string): Promise<string> {
  try {
    const username = githubUrl.split("/").pop();

    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    const userData = await userResponse.json();

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
    );
    const reposData = await reposResponse.json();

    return `
      Username: ${userData.login}
      Name: ${userData.name || "Tidak ada nama"}
      Bio: ${userData.bio || "Tidak ada bio"}
      Public Repos: ${userData.public_repos}
      Followers: ${userData.followers}
      Following: ${userData.following}
      Recent Repos: ${reposData
        .map((repo: any) => `${repo.name} (${repo.language || "Unknown"})`)
        .join(", ")}
    `;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return `Error fetching GitHub data for ${githubUrl}`;
  }
}

async function generateRoast(profileData: string): Promise<string> {
  const prompt = `
    Kamu adalah seorang comedian roaster profesional yang ahli dalam bahasa Indonesia. 
    Buatlah roasting yang lucu, jenaka, dan menyakitkan untuk profil berikut:

    ${profileData}

    Aturan roasting:
    1. Gunakan bahasa Indonesia yang santai dan gaul dengan target user nya adalah gen-z
    2. Fokus pada hal-hal profesional (skills, repo GitHub, pengalaman kerja)
    3. Buat jokes yang cerdas dan menghibur, menyakiti tidak masalah
    4. Panjang roasting sekitar 5-8 kalimat
    5. Akhiri dengan motivasi positif yang lucu dan menghibur (menyakiti tidak masalah)

    Contoh style: "Wah LinkedIn-nya keren banget, tapi kok GitHub-nya sepi kayak angkot malam ya? 😅"
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "Kamu adalah comedian roaster pandai mengolah kata menjadi sedikit menghina namun lucu dan pandai berbahasa Indonesia."
    }
  });

  if(response?.text) {
    return response.text;
  }

  return generateFallbackRoast(profileData);
}

function generateFallbackRoast(profileData: string): string {
  const templates = [
    "Wah profil yang menarik! Tapi sepertinya masih ada yang kurang nih... mungkin perlu lebih banyak project atau skill baru? 😄",
    "LinkedIn-nya udah bagus, GitHub juga lumayan, tapi kok rasanya masih ada yang missing ya? Mungkin saatnya upgrade skill! 🚀",
    "Profile-nya udah oke sih, tapi kalau mau jadi yang terdepan mungkin perlu sedikit lebih effort lagi ya! Keep learning! 💪",
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
