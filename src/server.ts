import fastify from 'fastify';
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const app = fastify()

const prisma = new PrismaClient({
    log: ['query'], // cada query que for feita ao banco de dados, ele vai fazer um log dessa query sendo feita
})

app.post('/events', async (request, replay) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximunAttendees: z.number().int().positive().nullable(),
    })

    const data = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximunAttendees: data.maximunAttendees,
            slug: new Date().toISOString(),
        }
    })

    return replay.status(201).send({ eventId: event.id })
})

app.listen({ port: 3334 }).then(() => {
    console.log('HTTP server running!')
})