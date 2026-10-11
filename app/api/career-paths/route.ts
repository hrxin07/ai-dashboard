import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
export async function GET(){const user=await getCurrentAuthUser();if(!user)return errorResponse("未登录或登录状态已过期",401);try{return successResponse(await prisma.careerPath.findMany({orderBy:{name:"asc"}}),"获取职业方向成功")}catch(e){console.error(e);return errorResponse("职业方向读取失败",500)}}
