import mongoose from 'mongoose';
//user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['client', 'freelancer'],
    required: true
  },
  skills: {
    type: [String], // Only for freelancers
  },
  experience: {
    type: Number, // Only for freelancers
  },
  ratings: {
    type: Number, // Only for freelancers
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//project
const projectSchema = new mongoose.Schema({
  clientId: {
    type: String, // Using String as specified
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  skills: {
    type: [String], // Array of skills required for the project
    required: true
  },
  bids: {
    type: [String], // Assuming this stores IDs or details of the bids
    default: []
  },
  bidAmounts: {
    type: [Number], // Array to keep track of bid amounts
    default: []
  },
  postedDate: {
    type: String, // Storing date as a string
    default: new Date().toISOString() // Defaulting to the current date
  },
  status: {
    type: String,
    enum: ['Available', 'In Progress', 'Completed'],
    default: "Available"
  },
  freelancerId: {
    type: String // Using String as specified
  },
  freelancerName: {
    type: String
  },
  deadline: {
    type: String // Assuming deadline is stored as a string date
  },
  submission: {
    type: Boolean,
    default: false
  },
  submissionAccepted: {
    type: Boolean,
    default: false
  },
  projectLink: {
    type: String,
    default: ""
  },
  manualLink: {
    type: String,
    default: ""
  },
  submissionDescription: {
    type: String,
    default: ""
  }
});

//application
const applicationSchema = new mongoose.Schema({
  projectId: {
    type: String, // Consider using mongoose.Schema.Types.ObjectId for actual references
    required: true
  },
  clientId: {
    type: String, // Consider using mongoose.Schema.Types.ObjectId
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  freelancerId: {
    type: String, // Consider using mongoose.Schema.Types.ObjectId
    required: true
  },
  freelancerName: {
    type: String,
    required: true
  },
  freelancerEmail: {
    type: String,
    required: true
  },
  freelancerSkills: {
    type: [String], // Array to store skills of the freelancer
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  requiredSkills: {
    type: [String], // Array to store skills required for the project
    required: true
  },
  proposal: {
    type: String, // Text field to store freelancer's proposal
    required: true
  },
  bidAmount: {
    type: Number, // The amount freelancer bids for the project
    required: true
  },
  estimatedTime: {
    type: Number, // Estimated time to complete the project (e.g., in hours or days)
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'], // Enum to ensure valid status
    default: 'Pending'
  }
});

//chats
// Define the chat message schema
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who sent the message
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // Automatically set the current date and time
  }
});

// Define the chat schema
const chatSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      senderName: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      file: {
        type: String, // URL or path to the file
        default: ''
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});


//freelancer
const freelancerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  experience: {
    type: Number,
    default: 0
  },
  currentProjects: {
    type: [mongoose.Schema.Types.ObjectId], // Reference to Project
    ref: 'Project',
    default: []
  },
  completedProjects: {
    type: [mongoose.Schema.Types.ObjectId], // Reference to Project
    ref: 'Project',
    default: []
  },
  applications: {
    type: [mongoose.Schema.Types.ObjectId], // Reference to Application
    ref: 'Application',
    default: []
  },
  funds: {
    type: Number,
    default: 0
  }
});

//jwt 
userSchema.methods.generateToken= function () {
  try {
    return jwt.sign({
      userId: this._id.toString(),
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    },
  )
  } catch (error) {
    console.log(error);
  }

}

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Application = mongoose.model('Application', applicationSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Freelancer = mongoose.model('Freelancer', freelancerSchema);

export {User, Project, Application, Chat, Freelancer};
