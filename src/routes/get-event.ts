// RETORNA DADOS DE UM ÚNICO EVENTO

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    200: {
                        event: z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            slug: z.string(),
                            details: z.string().nullable(),
                            maximunAttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int(),
                        })
                    }
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params

            const event = await prisma.event.findUnique({
                select: { // valores selecionados para retornar na rota
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximunAttendees: true,
                    _count: { // retorna o número de particiántes do evento buscado
                        select: {
                            attendees: true
                        }
                    }
                },
                where: {
                    id: eventId
                }
            })

            if (event === null) {
                throw new Error('event not found')
            }

            return reply.status(200).send({
                event: {
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    details: event.details,
                    maximunAttendees: event.maximunAttendees, // máximo de participantes
                    attendeesAmount: event._count.attendees // atual quantidade de participantes
                }
            })
        })
}