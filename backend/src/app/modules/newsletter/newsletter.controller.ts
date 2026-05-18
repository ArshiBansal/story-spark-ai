import { Request, Response } from "express";
import * as newsletterService from "./newsletter.service";

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, name, source } = req.body;
    const userId = (req as any).user?.id; // from JWT if logged in
    const result = await newsletterService.subscribeNewsletter(email, name, source, userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;

    const result = await newsletterService.verifyNewsletter(token);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await newsletterService.unsubscribeNewsletter(email);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};