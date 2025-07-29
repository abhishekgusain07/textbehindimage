import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// Get all public projects for the homepage
export const getPublicProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('textBehindProjects')
      .withIndex('by_public', (q) => q.eq('isPublic', true))
      .order('desc')
      .take(20);

    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        originalImageUrl: project.originalImageStorageId
          ? await ctx.storage.getUrl(project.originalImageStorageId)
          : null,
        processedImageUrl: project.processedImageStorageId
          ? await ctx.storage.getUrl(project.processedImageStorageId)
          : null,
      }))
    );
  },
});

// Get user's projects (requires auth)
export const getUserProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const projects = await ctx.db
      .query('textBehindProjects')
      .withIndex('by_user_created', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();

    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        originalImageUrl: project.originalImageStorageId
          ? await ctx.storage.getUrl(project.originalImageStorageId)
          : null,
        processedImageUrl: project.processedImageStorageId
          ? await ctx.storage.getUrl(project.processedImageStorageId)
          : null,
      }))
    );
  },
});

// Get a single project by ID
export const getProject = query({
  args: { projectId: v.id('textBehindProjects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    // Check if user can access this project
    const userId = await getAuthUserId(ctx);
    if (!project.isPublic && project.userId !== userId) {
      throw new Error('Not authorized to view this project');
    }

    return {
      ...project,
      originalImageUrl: project.originalImageStorageId
        ? await ctx.storage.getUrl(project.originalImageStorageId)
        : null,
      processedImageUrl: project.processedImageStorageId
        ? await ctx.storage.getUrl(project.processedImageStorageId)
        : null,
    };
  },
});

// Create a new project
export const createProject = mutation({
  args: {
    title: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const now = Date.now();
    return await ctx.db.insert('textBehindProjects', {
      userId,
      title: args.title,
      textLayers: [],
      isPublic: args.isPublic,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update project with image
export const updateProjectImage = mutation({
  args: {
    projectId: v.id('textBehindProjects'),
    originalImageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Project not found or not authorized');
    }

    await ctx.db.patch(args.projectId, {
      originalImageStorageId: args.originalImageStorageId,
      updatedAt: Date.now(),
    });
  },
});

// Update project text layers
export const updateProjectTextLayers = mutation({
  args: {
    projectId: v.id('textBehindProjects'),
    textLayers: v.array(
      v.object({
        id: v.number(),
        text: v.string(),
        fontFamily: v.string(),
        top: v.number(),
        left: v.number(),
        color: v.string(),
        fontSize: v.number(),
        fontWeight: v.number(),
        opacity: v.number(),
        shadowColor: v.string(),
        shadowSize: v.number(),
        rotation: v.number(),
        tiltX: v.number(),
        tiltY: v.number(),
        letterSpacing: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Project not found or not authorized');
    }

    await ctx.db.patch(args.projectId, {
      textLayers: args.textLayers,
      updatedAt: Date.now(),
    });
  },
});

// Save processed image
export const saveProcessedImage = mutation({
  args: {
    projectId: v.id('textBehindProjects'),
    processedImageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Project not found or not authorized');
    }

    await ctx.db.patch(args.projectId, {
      processedImageStorageId: args.processedImageStorageId,
      updatedAt: Date.now(),
    });
  },
});

// Generate upload URL for images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Delete project
export const deleteProject = mutation({
  args: { projectId: v.id('textBehindProjects') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Project not found or not authorized');
    }

    await ctx.db.delete(args.projectId);
  },
});
