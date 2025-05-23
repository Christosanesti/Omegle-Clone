import { NextRequest, NextResponse } from "next/server";

type Data = {
  name: string;
};

export default function handler(req: NextRequest) {
  return NextResponse.json({ name: "john doe" });
}
