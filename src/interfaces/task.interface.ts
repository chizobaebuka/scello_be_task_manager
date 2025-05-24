export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

export interface TaskAttributes {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
    startTime?: Date;
    endTime?: Date;
    durationMinutes?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TaskCreationAttributes extends Partial<Pick<TaskAttributes, 'id' | 'status'>> { }

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
    startTime?: Date;
    endTime?: Date;
    durationMinutes?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskInput {
    title: string;
    description: string;
    status?: TaskStatus;
    userId: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
}