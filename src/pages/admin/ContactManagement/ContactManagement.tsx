import  { useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";

import {
  MessageCircle,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ───────────────────────────────────────────
// TS Interfaces
// ───────────────────────────────────────────

interface IReply {
  _id: string;
  replyText: string;
  repliedBy: string;
  repliedAt: string;
}

type ContactStatus = "new" | "read" | "replied";

interface IContact {
  _id: string;
  clientName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  replies: IReply[];
}

interface ContactThreadProps {
  contact: IContact;
  onReply: (contactId: string, replyText: string) => void;
  onDelete: (contactId: string, replyId: string) => void;
}

// ───────────────────────────────────────────
// Mock Data (Typed)
// ───────────────────────────────────────────

const mockContacts: IContact[] = [
  {
    _id: "1",
    clientName: "John Doe",
    email: "john@example.com",
    subject: "Support Request",
    message: "I need help with my order.",
    status: "replied",
    createdAt: "2024-01-15T10:30:00Z",
    replies: [
      {
        _id: "r1",
        replyText:
          "Thank you for contacting us. We are looking into your order.",
        repliedBy: "admin@company.com",
        repliedAt: "2024-01-15T14:00:00Z",
      },
    ],
  },
  {
    _id: "2",
    clientName: "Jane Smith",
    email: "jane@example.com",
    subject: "Feature Request",
    message: "Can you add dark mode?",
    status: "read",
    createdAt: "2024-01-16T09:15:00Z",
    replies: [],
  },
  {
    _id: '3',
    clientName: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'Billing Issue',
    message: 'I was charged twice for the same order. Please refund immediately.',
    status: 'new',
    createdAt: '2024-01-16T11:45:00Z',
    replies: [],
  },
];

// ───────────────────────────────────────────
// Contact Thread (TSX)
// ───────────────────────────────────────────

const ContactThread = ({ contact, onReply, onDelete }: ContactThreadProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(contact._id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  const statusConfig: Record<
    ContactStatus,
    { icon: any; color: string; label: string }
  > = {
    new: { icon: AlertCircle, color: "#d32f2f", label: "New" },
    read: { icon: Clock, color: "#f9a825", label: "Read" },
    replied: { icon: CheckCircle, color: "#2e7d32", label: "Replied" },
  };

  const config = statusConfig[contact.status];
  const StatusIcon = config.icon;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      {/* Header */}
      <Box
        sx={{ p: 2, cursor: "pointer", "&:hover": { background: "#fafafa" } }}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2} alignItems="center">
            <StatusIcon size={22} color={config.color} />

            <Box>
              <Typography fontWeight={600}>{contact.clientName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {contact.email}
              </Typography>

              <Typography mt={1} fontWeight={600}>
                {contact.subject}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {contact.message}
              </Typography>

              <Typography variant="caption" color="text.disabled">
                {formatDate(contact.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Box>
            {isExpanded ? (
              <ChevronUp size={24} color="#777" />
            ) : (
              <ChevronDown size={24} color="#777" />
            )}
          </Box>
        </Box>
      </Box>

      {/* Expandable Content */}
      <Collapse in={isExpanded}>
        <Box p={2} borderTop="1px solid #eee">
          {/* Original Message */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <MessageCircle size={18} color="#1976d2" />
              <Typography fontWeight={600}>Original Message</Typography>
            </Box>

            <Typography mt={1}>{contact.message}</Typography>
          </Paper>

          {/* Replies */}
          {contact.replies.length > 0 && (
            <Box>
              <Typography fontWeight={600} mb={1}>
                Replies ({contact.replies.length})
              </Typography>

              {contact.replies.map((reply, index) => (
                <Paper
                  key={reply._id}
                  variant="outlined"
                  sx={{ p: 2, mb: 1, background: "#e8f5e9" }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600}>
                        Reply #{index + 1}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        From: {reply.repliedBy}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={() => onDelete(contact._id, reply._id)}
                      color="error"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>

                  <Typography mt={1}>{reply.replyText}</Typography>

                  <Typography variant="caption" color="text.disabled">
                    {formatDate(reply.repliedAt)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {/* Reply Form */}
          {!isReplying ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<Send size={18} />}
              onClick={() => setIsReplying(true)}
            >
              {contact.replies.length > 0 ? "Add Another Reply" : "Send Reply"}
            </Button>
          ) : (
            <Box mt={2}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply…"
              />

              <Box display="flex" gap={2} mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Send size={18} />}
                  disabled={!replyText.trim()}
                  onClick={handleSendReply}
                >
                  Send
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

// ───────────────────────────────────────────
// Dashboard Wrapper (TSX)
// ───────────────────────────────────────────

const ContactManagementDashboard = () => {
  const [contacts, setContacts] = useState<IContact[]>(mockContacts);
  const [filterStatus, setFilterStatus] = useState<ContactStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    const statusMatch =
      filterStatus === "all" || contact.status === filterStatus;

    const q = searchQuery.toLowerCase();
    const searchMatch =
      contact.clientName.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.subject.toLowerCase().includes(q);

    return statusMatch && searchMatch;
  });

  const handleReply = (contactId: string, replyText: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c._id === contactId
          ? {
              ...c,
              status: "replied",
              replies: [
                ...c.replies,
                {
                  _id: `r${Date.now()}`,
                  replyText,
                  repliedBy: "admin@company.com",
                  repliedAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
  };

  const handleDeleteReply = (contactId: string, replyId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c._id === contactId
          ? { ...c, replies: c.replies.filter((r) => r._id !== replyId) }
          : c
      )
    );
  };

  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    read: contacts.filter((c) => c.status === "read").length,
    replied: contacts.filter((c) => c.status === "replied").length,
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Contact Management
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 3 }} >
          <Paper sx={{ p: 2 }}>
            <Typography>Total</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2, border: "1px solid #ffcdd2", bgcolor: "#ffebee" }}>
            <Typography color="error.main">New</Typography>
            <Typography variant="h4" color="error.main">
              {stats.new}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            sx={{ p: 2, border: "1px solid #fff59d", bgcolor: "#fffde7" }}
          >
            <Typography sx={{ color: "#f9a825" }}>Read</Typography>
            <Typography variant="h4" sx={{ color: "#f9a825" }}>
              {stats.read}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            sx={{ p: 2, border: "1px solid #c8e6c9", bgcolor: "#e8f5e9" }}
          >
            <Typography color="success.main">Replied</Typography>
            <Typography variant="h4" color="success.main">
              {stats.replied}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid  size={{ xs: 12, md: 8 }} >
            <TextField
              fullWidth
              placeholder="Search by name, email, or subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ContactStatus | "all")
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Typography mt={2} variant="caption">
          Showing {filteredContacts.length} of {contacts.length}
        </Typography>
      </Paper>

      {/* Contact List */}
      <Box>
        {filteredContacts.map((c) => (
          <Box key={c._id} mb={2}>
            <ContactThread
              contact={c}
              onReply={handleReply}
              onDelete={handleDeleteReply}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ContactManagementDashboard;
