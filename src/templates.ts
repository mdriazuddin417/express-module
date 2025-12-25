
export const TEMPLATES = {
  controller: `import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { __NAME__Service } from "./__name__.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const doc = await __NAME__Service.create(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "__name__ created", data: doc });
});

const getAll = catchAsync(async (_req: Request, res: Response) => {
  const docs = await __NAME__Service.getAll();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "__name__ list", data: docs });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const doc = await __NAME__Service.getById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "__name__ found", data: doc });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const doc = await __NAME__Service.update(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "__name__ updated", data: doc });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const doc = await __NAME__Service.delete(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "__name__ deleted", data: doc });
});

export const __NAME__Controller = { create, getAll, getById, update, remove };
`,
  interface: `export type __NAME__Status = "Active" | "Inactive";

export default interface T__NAME__ {
  name: string;
  status: __NAME__Status;
}
`,
  model: `import { model, Schema } from "mongoose";
import type T__NAME__ from "./__name__.interface";

const __camel__Schema = new Schema<T__NAME__>(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Active","Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export const __NAME__ = model<T__NAME__>("__NAME__", __camel__Schema);
export default __NAME__;
`,
  service: `import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { __NAME__ } from "./__name__.model";
import type T__NAME__ from "./__name__.interface";

export const __NAME__Service = {
  create: async (payload: T__NAME__) => {
    const doc = await __NAME__.create(payload);
    return doc;
  },

  getAll: async (query: Record<string, any>) => {
  const qb = new QueryBuilder( __NAME__.find({ isActive: true }), query);
  const sortableFields = ["createdAt", "name", "status", "isActive"];

        const result = await qb.search(sortableFields)
            .filter()
            .sort({ createdAt: -1 })
            .fields()
            .paginate();

        const [data, meta] = await Promise.all([result.build(), qb.getMeta()]);
        return { data, meta };
  },

  getById: async (id: string) => {
    const doc = await __NAME__.findById(id);
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "__name__ not found");
    return doc;
  },

  update: async (id: string, payload: Partial<T__NAME__>) => {
    const doc = await __NAME__.findByIdAndUpdate(id, payload, { new: true });
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "__name__ not found");
    return doc;
  },

  delete: async (id: string) => {
    const doc = await __NAME__.findByIdAndDelete(id);
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "__name__ not found");
    return doc;
  }
};
`,
  validation: `import { z } from "zod";

export const create__NAME__ZodSchema = z.object({
  name: z.string().min(1),
  status: z.enum(["Active","Inactive"]).optional()
});

export const update__NAME__ZodSchema = create__NAME__ZodSchema.partial();
`,
  route: `import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { __NAME__Controller } from "./__name__.controller";
import { create__NAME__ZodSchema, update__NAME__ZodSchema } from "./__name__.validation";

const router = express.Router();

router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(create__NAME__ZodSchema), __NAME__Controller.create);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), __NAME__Controller.getAll);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), __NAME__Controller.getById);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(update__NAME__ZodSchema), __NAME__Controller.update);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), __NAME__Controller.remove);

export const __NAME__Routes = router;
`
} as const;
