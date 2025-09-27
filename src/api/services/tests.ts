import API from "../axios";



export interface TestResult {

 _id: string;

 studentId: string;

 date: string;

 score: number;

}



// save test result (stress, depression, anxiety, burnout)

export async function saveTestResult(

 type: "stress" | "depression" | "anxiety" | "burnout",

 payload: { score: number }

): Promise<TestResult> {

 const { data } = await API.post<TestResult>(`/tests/${type}`, payload);

 return data;

}





// get latest test result for logged-in student

export async function getLatestTestResult(

 type: "stress" | "depression" | "anxiety" | "burnout"

): Promise<TestResult | null> {

 try {

  const { data } = await API.get<TestResult>(`/tests/${type}`);

  return data; // backend already returns latest single result

 } catch (err: any) {

  console.error("Error fetching latest test result:", err);

  return null;

 }

}









