// The database does not support
// use Memory storage
const conversationStore = [];

class Message {
    constructor(sender, receiver, message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }
    static async pushConversation(sender, receiver, message) {
        conversationStore.push(new Message(sender, receiver, message));
    }
    static async getReceivedMail(receiver) {
        const conversations = [];
        for (const conversation of conversationStore) {
            if (conversation.receiver === receiver) {
                conversations.push(conversation);
            }
        }
        return conversations;
    }
}

module.exports = { Message };