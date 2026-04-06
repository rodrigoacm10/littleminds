import { Message } from "./message.entity";

export class Conversation {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly messages: Message[],
        public readonly isArchived: boolean,
        
    ) {}
}