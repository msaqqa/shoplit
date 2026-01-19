export async function actionWrapper<T>(actionFn: () => Promise<T>): Promise<T> {
  try {
    return await actionFn();
  } catch (error: unknown) {
    const rawMessage = error instanceof Error ? error.message : String(error);

    if (process.env.NODE_ENV === "development")
      console.error("Server Action Error:", error);

    let errorType = "DATABASE_ERROR";
    const isNetworkIssue =
      rawMessage.includes("Can't reach database") ||
      rawMessage.includes("Timed out fetching a new connection") ||
      rawMessage.includes("Can't connect to") ||
      rawMessage.includes("connection pool");

    if (isNetworkIssue) {
      errorType = "NETWORK_ERROR";
    }

    throw new Error(
      JSON.stringify({
        status: 500,
        message: errorType,
        isServer: true,
      })
    );
  }
}
