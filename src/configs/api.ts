console.log("🚀 ~ process.env.NODE_ENV:", process.env.NODE_ENV);
export default {
	baseUrl:
		process.env.NODE_ENV === "development1"
			? "http://localhost:8080"
			:
			process.env.NEXT_PUBLIC_API_BASE_URL,
};
