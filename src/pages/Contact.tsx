import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export function Contact() {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Direccion',
      content: 'Av. Providencia 1234, Santiago, Chile',
    },
    {
      icon: Phone,
      title: 'Telefono',
      content: '+56 2 2345 6789',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'hola@luxe.cl',
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Vie: 9:00 - 18:00',
    },
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-4">
            Contacto
          </h1>
          <p className="text-sm font-montserrat text-luxe-gray-medium max-w-lg mx-auto">
            Estamos aqui para ayudarte. Envianos un mensaje y te responderemos a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-luxe-gray-light flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-luxe-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-1">
                      {info.title}
                    </h3>
                    <p className="text-sm font-montserrat text-luxe-gray-medium">
                      {info.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-luxe-gray-light p-6 md:p-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                    Nombre
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                  Asunto
                </label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white resize-none"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                <Send className="w-4 h-4" />
                Enviar Mensaje
              </Button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
