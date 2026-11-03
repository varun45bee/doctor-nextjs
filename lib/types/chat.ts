export interface MessageAttachment {
  url: string;
  name: string;
  size?: number;
  type?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "patient" | "doctor";
  senderName: string;
  senderPhotoURL?: string;
  text: string;
  attachments?: MessageAttachment[];
  read: boolean;
  readAt?: any;
  createdAt: any;
}

export interface Conversation {
  id: string;
  patientId: string;
  doctorId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientPhotoURL?: string;
  lastMessage: string;
  lastMessageAt: any;
  lastSenderRole?: "patient" | "doctor";
  unreadDoctorCount: number;
  unreadPatientCount: number;
  createdAt: any;
  updatedAt: any;
}

