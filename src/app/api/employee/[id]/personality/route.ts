import { apiSuccess } from "@/server/utils/api-response";
import { patchEmployeeService } from "@/server/services/employee.service";
import { NextRequest } from "next/server";
import { withDb } from "../../../_lib/handler";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const data = await patchEmployeeService(id, { personality: body.personality });
    return apiSuccess(data, "data updated successfully");
  });
}
