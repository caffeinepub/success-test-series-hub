import React, { useState } from 'react';
import { useGetSliders, useDeleteSlider } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import SliderFormModal from '../components/SliderFormModal';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminSliders() {
  const token = getSessionToken() || '';
  const { data: sliders = [], isLoading } = useGetSliders();
  const deleteSlider = useDeleteSlider();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this slider?')) return;
    try {
      await deleteSlider.mutateAsync({ token, id });
    } catch (err: any) {
      alert(err?.message || 'Failed to delete slider.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-rajdhani">Manage Sliders</h1>
          <p className="text-navy-400 text-sm mt-1">Upload and manage homepage poster slides</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slider
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-navy-400 py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading sliders...
        </div>
      ) : sliders.length === 0 ? (
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-navy-500 mx-auto mb-3" />
          <p className="text-navy-400">No sliders yet. Add your first poster!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sliders.map((slider) => (
            <div
              key={slider.id.toString()}
              className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden"
            >
              <div className="relative h-40 bg-navy-700">
                <img
                  src={slider.imageUrl}
                  alt={slider.title || 'Slider'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-navy-700/50">
                  <ImageIcon className="w-8 h-8 text-navy-500" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">
                    {slider.title || 'Untitled Slide'}
                  </p>
                  <p className="text-navy-400 text-xs truncate mt-0.5">{slider.imageUrl}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(slider.id)}
                  disabled={deleteSlider.isPending}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 shrink-0 ml-2"
                >
                  {deleteSlider.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SliderFormModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
