import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const N2YO_BASE = "https://api.n2yo.com/rest/v1/satellite";

function getApiKey(): string {
  const key = process.env.N2YO_API_KEY;
  if (!key || key.trim() === "") {
    throw new Error("N2YO_API_KEY is not set");
  }
  return key;
}


