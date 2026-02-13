import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const DEFAULT_EVENT = {
  title: '',
  description: '',
  date: '',
  eventType: 'life',
  location: '',
  photo: ''
};

// Пример: events — массив событий мемориала
import React, { useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { timelineService } from '../services/api';

export default function TimelineEventMui({ memorialId }) {
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_EVENT);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const data = await timelineService.getByMemorial(memorialId);
        setEvents(Array.isArray(data) ? data : (data.events || []));
      } catch (err) {
        console.error('Ошибка загрузки событий', err);
        setEvents([]);
      }
      setLoading(false);
    }
    if (memorialId) fetchEvents();
  }, [memorialId]);

  const handleOpen = (event = null) => {
    setEditingEvent(event);
    setFormData(event ? {
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
    } : DEFAULT_EVENT);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
    setFormData(DEFAULT_EVENT);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      setFormData(prev => ({ ...prev, photo: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      fd.append('memorialId', memorialId);
      if (editingEvent) {
        await timelineService.update(editingEvent._id, fd);
      } else {
        await timelineService.create(memorialId, fd);
      }
      setOpen(false);
      setEditingEvent(null);
      setFormData(DEFAULT_EVENT);
      const data = await timelineService.getByMemorial(memorialId);
      setEvents(Array.isArray(data) ? data : (data.events || []));
    } catch (err) {
      console.error('Ошибка сохранения события', err);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await timelineService.remove(eventId);
      const data = await timelineService.getByMemorial(memorialId);
      setEvents(Array.isArray(data) ? data : (data.events || []));
    } catch (err) {
      console.error('Ошибка удаления события', err);
    }
  };
  if (loading) return <Typography>Загрузка событий...</Typography>;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Добавить событие
      </Button>
      {!events.length && <Typography>Нет событий для отображения.</Typography>}
      <Timeline position="alternate">
        {events.map((event, idx) => (
          <TimelineItem key={event._id || idx}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {idx < events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} sx={{ p: 2, mb: 2, position: 'relative' }}>
                <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 40 }} onClick={() => handleOpen(event)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleDelete(event._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" component="span">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">{event.eventType}</Typography>
                <Typography variant="body2" color="text.secondary">{event.date}</Typography>
                {event.location && (
                  <Typography variant="body2" color="text.secondary">📍 {event.location}</Typography>
                )}
                {event.photo && (
                  <img src={typeof event.photo === 'string' ? event.photo : URL.createObjectURL(event.photo)} alt="Фото события" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 8 }} />
                )}
                {event.imageUrl && !event.photo && (
                  <img src={event.imageUrl} alt="Фото события" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 8 }} />
                )}
                {event.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>{event.description}</Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvent ? 'Редактировать событие' : 'Добавить событие'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Заголовок" name="title" fullWidth value={formData.title} onChange={handleChange} />
          <TextField margin="normal" label="Описание" name="description" fullWidth multiline value={formData.description} onChange={handleChange} />
          <TextField margin="normal" label="Дата" name="date" type="date" fullWidth value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField margin="normal" label="Тип события" name="eventType" fullWidth value={formData.eventType} onChange={handleChange} />
          <TextField margin="normal" label="Место" name="location" fullWidth value={formData.location} onChange={handleChange} />
          <input type="file" name="photo" accept="image/*" onChange={handleChange} style={{ marginTop: 16 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
