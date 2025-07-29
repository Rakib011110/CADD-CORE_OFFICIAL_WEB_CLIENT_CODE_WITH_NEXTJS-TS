"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBriefcase, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiExternalLink,
  FiCalendar,
  FiClock,
  FiUser,
  FiFolder,
  FiUpload,
  FiImage,
  FiFile,
  FiX,
  FiSave,
  FiEye,
  FiGithub,
  FiGlobe,
  FiTag,
  FiSearch,
  FiFilter
} from "react-icons/fi";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Progress } from "@/components/UI/progress";
import Image from "next/image";
import { toast } from "sonner";

type ProjectTechnology = {
  name: string;
  color: string;
};

type ProjectFile = {
  id: string;
  name: string;
  type: "image" | "document" | "cad" | "other";
  url: string;
  size: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  progress: number;
  startDate: string;
  endDate?: string;
  estimatedCompletion?: string;
  client?: string;
  category: string;
  technologies: ProjectTechnology[];
  thumbnailUrl?: string;
  files: ProjectFile[];
  links: {
    github?: string;
    live?: string;
    portfolio?: string;
  };
  tasks: {
    total: number;
    completed: number;
  };
  createdAt: string;
  updatedAt: string;
};

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Modern Residential Building Design",
    description: "Complete architectural design for a 3-story residential building with modern aesthetics and sustainable features.",
    status: "in-progress",
    priority: "high",
    progress: 75,
    startDate: "2024-01-15",
    estimatedCompletion: "2024-03-30",
    client: "Green Living Developers",
    category: "Architecture",
    technologies: [
      { name: "AutoCAD", color: "bg-blue-100 text-blue-800" },
      { name: "SketchUp", color: "bg-cyan-100 text-cyan-800" },
      { name: "V-Ray", color: "bg-purple-100 text-purple-800" }
    ],
    thumbnailUrl: "https://placehold.co/400x300/007ACC/FFFFFF?text=Building+Design",
    files: [
      { id: "1", name: "Floor Plans.dwg", type: "cad", url: "#", size: "2.5 MB" },
      { id: "2", name: "3D Renders.zip", type: "image", url: "#", size: "15.3 MB" },
      { id: "3", name: "Project Brief.pdf", type: "document", url: "#", size: "1.2 MB" }
    ],
    links: {
      portfolio: "https://portfolio.example.com/residential-design"
    },
    tasks: { total: 20, completed: 15 },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-28"
  },
  {
    id: "2",
    title: "Industrial Equipment 3D Model",
    description: "Detailed 3D modeling and rendering of industrial manufacturing equipment for product visualization.",
    status: "completed",
    priority: "medium",
    progress: 100,
    startDate: "2023-11-01",
    endDate: "2023-12-20",
    client: "TechnoMach Industries",
    category: "3D Modeling",
    technologies: [
      { name: "3ds Max", color: "bg-orange-100 text-orange-800" },
      { name: "V-Ray", color: "bg-purple-100 text-purple-800" },
      { name: "Photoshop", color: "bg-blue-100 text-blue-800" }
    ],
    thumbnailUrl: "https://placehold.co/400x300/FF6B35/FFFFFF?text=3D+Equipment",
    files: [
      { id: "4", name: "Equipment_Model.max", type: "cad", url: "#", size: "45.2 MB" },
      { id: "5", name: "Final_Renders.zip", type: "image", url: "#", size: "25.8 MB" },
      { id: "6", name: "Technical_Specs.pdf", type: "document", url: "#", size: "890 KB" }
    ],
    links: {
      portfolio: "https://portfolio.example.com/industrial-equipment",
      live: "https://demo.example.com/equipment-viewer"
    },
    tasks: { total: 15, completed: 15 },
    createdAt: "2023-11-01",
    updatedAt: "2023-12-20"
  },
  {
    id: "3",
    title: "Office Interior Design Concept",
    description: "Modern office space design with collaborative work areas and sustainable design principles.",
    status: "planning",
    priority: "low",
    progress: 25,
    startDate: "2024-02-01",
    estimatedCompletion: "2024-04-15",
    client: "StartupHub Co.",
    category: "Interior Design",
    technologies: [
      { name: "SketchUp", color: "bg-cyan-100 text-cyan-800" },
      { name: "V-Ray", color: "bg-purple-100 text-purple-800" },
      { name: "Photoshop", color: "bg-blue-100 text-blue-800" }
    ],
    thumbnailUrl: "https://placehold.co/400x300/1BA1E2/FFFFFF?text=Office+Design",
    files: [
      { id: "7", name: "Concept_Sketches.pdf", type: "document", url: "#", size: "3.4 MB" },
      { id: "8", name: "Mood_Board.jpg", type: "image", url: "#", size: "2.1 MB" }
    ],
    links: {},
    tasks: { total: 12, completed: 0 },
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05"
  }
];

export default function WorkingProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "planning" | "in-progress" | "completed" | "on-hold">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    client: "",
    priority: "medium" as const,
    estimatedCompletion: "",
    technologies: [] as string[]
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "planning": return "bg-yellow-100 text-yellow-800";
      case "on-hold": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      status: "planning",
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      technologies: newProject.technologies.map(tech => ({
        name: tech,
        color: "bg-blue-100 text-blue-800"
      })),
      files: [],
      links: {},
      tasks: { total: 0, completed: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects([project, ...projects]);
    setNewProject({
      title: "",
      description: "",
      category: "",
      client: "",
      priority: "medium",
      estimatedCompletion: "",
      technologies: []
    });
    setIsCreating(false);
    toast.success("Project created successfully!");
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success("Project deleted successfully!");
  };

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const inProgressProjects = projects.filter(p => p.status === "in-progress").length;
  const onTimeProjects = projects.filter(p => {
    if (!p.estimatedCompletion) return true;
    return new Date(p.estimatedCompletion) >= new Date();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FiBriefcase size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Working Projects</h1>
              <p className="text-purple-100 text-lg">Manage and track your project portfolio</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 gap-2"
          >
            <FiPlus size={16} />
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900"> 0</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiBriefcase className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900"> 0 </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiEye className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiClock className="text-yellow-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">On Schedule</p>
              <p className="text-2xl font-bold text-gray-900"> 0 </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiCalendar className="text-purple-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Projects</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
        </div>
      </div>

   
      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                  <FiX size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your project"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Architecture, 3D Modeling"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client
                    </label>
                    <input
                      type="text"
                      value={newProject.client}
                      onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Client name (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({...newProject, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Completion
                    </label>
                    <input
                      type="date"
                      value={newProject.estimatedCompletion}
                      onChange={(e) => setNewProject({...newProject, estimatedCompletion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} className="gap-2">
                    <FiSave size={16} />
                    Create Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                  <FiX size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <Badge key={tech.name} className={tech.color}>
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Project Files</h3>
                    <div className="space-y-2">
                      {selectedProject.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FiFile className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <FiExternalLink size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Project Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{selectedProject.progress}%</span>
                      </div>
                      <Progress value={selectedProject.progress} className="h-2" />
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tasks</span>
                        <span className="text-sm font-medium">
                          {selectedProject.tasks.completed}/{selectedProject.tasks.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedProject.status)}>
                          {selectedProject.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <Badge className={getPriorityColor(selectedProject.priority)}>
                          {selectedProject.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedProject.category}</span>
                      </div>
                      {selectedProject.client && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Client:</span>
                          <span className="font-medium">{selectedProject.client}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started:</span>
                        <span className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                      </div>
                      {selectedProject.estimatedCompletion && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due:</span>
                          <span className="font-medium">{new Date(selectedProject.estimatedCompletion).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Links */}
                  {Object.keys(selectedProject.links).length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Links</h3>
                      <div className="space-y-2">
                        {selectedProject.links.github && (
                          <a href={selectedProject.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <FiGithub size={16} />
                            GitHub Repository
                          </a>
                        )}
                        {selectedProject.links.live && (
                          <a href={selectedProject.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <FiGlobe size={16} />
                            Live Demo
                          </a>
                        )}
                        {selectedProject.links.portfolio && (
                          <a href={selectedProject.links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <FiExternalLink size={16} />
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
