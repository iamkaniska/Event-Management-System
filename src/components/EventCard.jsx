import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span>{event.location}</span>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-blue-600">
            {event.capacity} spots available
          </span>
          <span className="font-semibold">
            ${event.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}