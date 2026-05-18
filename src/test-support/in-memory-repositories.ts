import {
  Article,
  AgeGroup,
  Comment,
  Conversation,
  ForumPost,
  Message,
  MessageRole,
  MessageVersion,
  PostSupport,
  Role,
  User,
  type ArticleRepository,
  type CommentRepository,
  type ConversationRepository,
  type ForumPostRepository,
  type MessageRepository,
  type MessageVersionRepository,
  type PostSupportRepository,
  type UserRepository,
} from '../domain';

export class InMemoryUserRepository implements UserRepository {
  private readonly items = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.items.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.items.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();

    for (const user of this.items.values()) {
      if (user.email.value === normalizedEmail) {
        return user;
      }
    }

    return null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }

  async findAll(): Promise<User[]> {
    return [...this.items.values()];
  }

  async findByRole(role: Role): Promise<User[]> {
    return [...this.items.values()].filter((user) => user.role === role);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

export class InMemoryArticleRepository implements ArticleRepository {
  private readonly items = new Map<string, Article>();

  async save(article: Article): Promise<void> {
    this.items.set(article.id, article);
  }

  async findById(id: string): Promise<Article | null> {
    return this.items.get(id) ?? null;
  }

  async findAll(): Promise<Article[]> {
    return [...this.items.values()];
  }

  async findPublished(): Promise<Article[]> {
    return [...this.items.values()].filter((article) => article.isPublished);
  }

  async findDraftsByAuthor(authorId: string): Promise<Article[]> {
    return [...this.items.values()].filter(
      (article) => article.authorId === authorId && !article.isPublished,
    );
  }

  async findByAuthorId(authorId: string): Promise<Article[]> {
    return [...this.items.values()].filter(
      (article) => article.authorId === authorId,
    );
  }

  async findByAgeGroup(ageGroup: AgeGroup): Promise<Article[]> {
    return [...this.items.values()].filter(
      (article) => article.ageGroup === ageGroup,
    );
  }

  async findPublishedByAgeGroup(ageGroup: AgeGroup): Promise<Article[]> {
    return [...this.items.values()].filter(
      (article) => article.ageGroup === ageGroup && article.isPublished,
    );
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

export class InMemoryConversationRepository implements ConversationRepository {
  private readonly items = new Map<string, Conversation>();

  async save(conversation: Conversation): Promise<void> {
    this.items.set(conversation.id, conversation);
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.items.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return [...this.items.values()].filter(
      (conversation) => conversation.userId === userId,
    );
  }

  async findActiveByUserId(userId: string): Promise<Conversation[]> {
    return [...this.items.values()].filter(
      (conversation) => conversation.userId === userId && !conversation.isArchived,
    );
  }

  async findArchivedByUserId(userId: string): Promise<Conversation[]> {
    return [...this.items.values()].filter(
      (conversation) => conversation.userId === userId && conversation.isArchived,
    );
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

export class InMemoryMessageRepository implements MessageRepository {
  private readonly items = new Map<string, Message>();

  async save(message: Message): Promise<void> {
    this.items.set(message.id, message);
  }

  async findById(id: string): Promise<Message | null> {
    return this.items.get(id) ?? null;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return [...this.items.values()].filter(
      (message) => message.conversationId === conversationId,
    );
  }

  async findByConversationIdAndRole(
    conversationId: string,
    role: MessageRole,
  ): Promise<Message[]> {
    return [...this.items.values()].filter(
      (message) =>
        message.conversationId === conversationId && message.role === role,
    );
  }

  async findLastByConversationId(conversationId: string): Promise<Message | null> {
    const messages = await this.findByConversationId(conversationId);
    return (
      messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ??
      null
    );
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

export class InMemoryMessageVersionRepository implements MessageVersionRepository {
  private readonly items = new Map<string, MessageVersion>();

  async save(version: MessageVersion): Promise<void> {
    this.items.set(version.id, version);
  }

  async findById(id: string): Promise<MessageVersion | null> {
    return this.items.get(id) ?? null;
  }

  async findByMessageId(messageId: string): Promise<MessageVersion[]> {
    return [...this.items.values()].filter(
      (version) => version.messageId === messageId,
    );
  }

  async findLatestByMessageId(messageId: string): Promise<MessageVersion | null> {
    const versions = await this.findByMessageId(messageId);
    return (
      versions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ??
      null
    );
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}

export class InMemoryForumPostRepository implements ForumPostRepository {
  private readonly items = new Map<string, ForumPost>();

  async save(post: ForumPost): Promise<void> {
    this.items.set(post.id, post);
  }

  async findById(id: string): Promise<ForumPost | null> {
    return this.items.get(id) ?? null;
  }

  async findAll(): Promise<ForumPost[]> {
    return [...this.items.values()];
  }

  async findByAuthorId(authorId: string): Promise<ForumPost[]> {
    return [...this.items.values()].filter((post) => post.authorId === authorId);
  }

  async findByAgeGroup(ageGroup: AgeGroup): Promise<ForumPost[]> {
    return [...this.items.values()].filter((post) => post.ageGroup === ageGroup);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

export class InMemoryCommentRepository implements CommentRepository {
  private readonly items = new Map<string, Comment>();

  async save(comment: Comment): Promise<void> {
    this.items.set(comment.id, comment);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.items.get(id) ?? null;
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return [...this.items.values()].filter((comment) => comment.postId === postId);
  }

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    return [...this.items.values()].filter(
      (comment) => comment.authorId === authorId,
    );
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

export class InMemoryPostSupportRepository implements PostSupportRepository {
  private readonly items = new Map<string, PostSupport>();

  async save(support: PostSupport): Promise<void> {
    this.items.set(support.id, support);
  }

  async findByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<PostSupport | null> {
    return (
      [...this.items.values()].find(
        (support) => support.userId === userId && support.postId === postId,
      ) ?? null
    );
  }

  async findByPostId(postId: string): Promise<PostSupport[]> {
    return [...this.items.values()].filter((support) => support.postId === postId);
  }

  async countByPostId(postId: string): Promise<number> {
    return (await this.findByPostId(postId)).length;
  }

  async existsByUserAndPost(userId: string, postId: string): Promise<boolean> {
    return (await this.findByUserAndPost(userId, postId)) !== null;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
