// connect to db and recieve request
const dbPromise = require('../config/db');

// link for this function will be (get) /api/calendar/export
// this function allows any user to generate an .ics file for all their bookings, to be able to put these in a calendar. 
const export_calendar = async (req, res) =>{

    // new db config requires this approach
    const db = await dbPromise;

    // 1. collect data
    const user_id = req.user.id;
   
    try{

        // 2. query bookings
        // this query was used previously. it gets the info about who you're meeting also.
        const bookings = await db.all(
            `
            SELECT 

            b.created_at AS booking_created_at, b.booking_id, 
            s.slot_title, s.start_time, s.end_time, s.slot_type,
            u.email AS meeting_partner_email, u.name AS meeting_partner_name

            FROM bookings b
            JOIN slots s ON b.slot_id = s.slot_id
            JOIN bookings b2 ON b2.slot_id = b.slot_id AND b2.user_id != ?
            JOIN users u ON b2.user_id = u.user_id
            WHERE b.user_id = ?

            ORDER BY booking_created_at ASC;
            `, 
            [user_id, user_id]
        );


        // 3. Reformat the start and end datetimes to be ics compatible
        // the following is an ai-generated code segment
        const formatDate = (dateInput) => {
            const d = new Date(dateInput);
            const pad = (n) => String(n).padStart(2, '0');
            return (
                d.getUTCFullYear() +
                pad(d.getUTCMonth() + 1) +
                pad(d.getUTCDate()) +
                'T' +
                pad(d.getUTCHours()) +
                pad(d.getUTCMinutes()) +
                pad(d.getUTCSeconds()) +
                'Z'  // Z = UTC
            );
        };
        // end of ai-generated segment


        // 4. Build a different VEVENT block (an ics component) for each booking
        const events = bookings.map((booking) => {

            // this segment is ai-generated
            return [
                'BEGIN:VEVENT',
                `UID:booking-${booking.booking_id}@socs`,
                `SUMMARY:${booking.slot_title}`,
                `DTSTART:${formatDate(booking.start_time)}`,
                `DTEND:${formatDate(booking.end_time)}`,
                `DESCRIPTION:Meeting with ${booking.meeting_partner_name} (${booking.meeting_partner_email})`,
                `ATTENDEE:mailto:${booking.meeting_partner_email}`,
                'END:VEVENT',
            ].join('\r\n');
            // end of ai-generated code segment 
        });


        // 5. wrap each VEVENT in a VCALENDAR group
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//SOCS Booking App//EN',
            ...events,
            'END:VCALENDAR',
        ].join('\r\n');


        // 6. Based on ai suggestion, set headers:
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="bookings.ics"');

        // 7. Communicate
        res.status(200).send(ics);
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to export ics.",
            error: err.message });
    }
};

module.exports = {export_calendar};
