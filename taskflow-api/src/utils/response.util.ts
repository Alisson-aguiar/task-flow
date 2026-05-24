export class ApiResponse {
    static success(data: any, message = 'Sucesso') {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }

    static error(message: string, statusCode = 400, errors?: any) {
        return {
            success: false,
            message,
            errors,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }

    static paginated(data: any[], total: number, page: number, limit: number) {
        return {
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
            timestamp: new Date().toISOString(),
        };
    }
}