import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id('users'), // Link to auth user
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user_id', ['userId']),

  textBehindProjects: defineTable({
    userId: v.id('users'), // Reference to auth user
    title: v.string(),
    originalImageStorageId: v.optional(v.id('_storage')),
    processedImageStorageId: v.optional(v.id('_storage')),
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
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_created', ['userId', 'createdAt'])
    .index('by_public', ['isPublic']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
