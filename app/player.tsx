'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

const track = { src: '/audio/cosmo-3.mp3', title: 'Музыка для работы', artist: 'Павел Маркелов', cover: '/player/cover.png' };

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

function PlayerIcon({ name }: { name: 'play' | 'pause' | 'volume' | 'muted' | 'download' }) {
  return (
    <svg className="player-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === 'play' && <><circle cx="12" cy="12" r="9.2" /><path d="M10.2 8.6v6.8l5.4-3.4-5.4-3.4Z" fill="currentColor" stroke="none" /></>}
      {name === 'pause' && <><circle cx="12" cy="12" r="9.2" /><path d="M10 9v6M14 9v6" /></>}
      {(name === 'volume' || name === 'muted') && <path d="M4 9.5v5h3.6l4.4 3.6V5.9L7.6 9.5H4Z" fill="currentColor" />}
      {name === 'volume' && <path d="M15.6 9.2a4 4 0 0 1 0 5.6M18 6.8a7.4 7.4 0 0 1 0 10.4" />}
      {name === 'muted' && <path d="m15.6 9.6 4.8 4.8m0-4.8-4.8 4.8" />}
      {name === 'download' && <path d="M12 4.5v10.2m-4-3.8 4 4 4-4M5.5 19.5h13" />}
    </svg>
  );
}

export default function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);

  const silent = muted || volume === 0;
  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;

  useEffect(() => {
    // The audio element can finish loading before hydration, so React misses its events: sync once on mount.
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.error) setFailed(true);
    if (audio.readyState >= 1 && Number.isFinite(audio.duration)) setDuration(audio.duration);
    setTime(audio.currentTime);
    setVolume(audio.volume);
    setMuted(audio.muted);
    setPlaying(!audio.paused);
  }, []);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const audio = audioRef.current;
    if (!audio) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({ title: track.title, artist: track.artist, artwork: [{ src: track.cover, sizes: '160x157', type: 'image/png' }] });
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => void audio.play()],
      ['pause', () => audio.pause()],
      ['seekbackward', () => { audio.currentTime = Math.max(0, audio.currentTime - 10); }],
      ['seekforward', () => { audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 10); }],
      ['seekto', details => { if (details.seekTime != null) audio.currentTime = details.seekTime; }],
    ];
    for (const [action, handler] of handlers) { try { session.setActionHandler(action, handler); } catch {} }
    return () => { for (const [action] of handlers) { try { session.setActionHandler(action, null); } catch {} } };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || failed) return;
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setTime(value);
  }

  function changeVolume(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    audio.muted = value === 0;
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted || audio.volume === 0) {
      if (audio.volume === 0) audio.volume = 0.5;
      audio.muted = false;
    } else {
      audio.muted = true;
    }
  }

  return (
    <div className="player" role="group" aria-label="Аудиоплеер">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setTime(0); }}
        onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
        onDurationChange={event => setDuration(event.currentTarget.duration)}
        onVolumeChange={event => { setVolume(event.currentTarget.volume); setMuted(event.currentTarget.muted); }}
        onError={() => { setFailed(true); setPlaying(false); }}
      />
      <img className={`player-cover${playing ? ' is-playing' : ''}`} src={track.cover} width="40" height="40" alt="" />
      <div className="player-main">
        <div className="player-row">
          <button type="button" className="player-button" onClick={toggle} disabled={failed} aria-label={playing ? 'Пауза' : 'Воспроизвести'}>
            <PlayerIcon name={playing ? 'pause' : 'play'} />
          </button>
          <span className="player-title" title={track.title}>{failed ? 'Трек недоступен' : track.title}</span>
          <span className="player-time" aria-hidden="true">{formatTime(time)} / {formatTime(duration)}</span>
          <div className="player-volume-group">
            <input
              className="player-range player-volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={silent ? 0 : volume}
              onChange={event => changeVolume(Number(event.target.value))}
              style={{ '--p': `${silent ? 0 : volume * 100}%` } as CSSProperties}
              aria-label="Громкость"
            />
            <button type="button" className="player-button" onClick={toggleMute} aria-pressed={silent} aria-label={silent ? 'Включить звук' : 'Выключить звук'}>
              <PlayerIcon name={silent ? 'muted' : 'volume'} />
            </button>
          </div>
          <a className="player-button" href={track.src} download={`${track.title}.mp3`} aria-label="Скачать трек" title="Скачать трек">
            <PlayerIcon name="download" />
          </a>
        </div>
        <input
          className="player-range player-seek"
          type="range"
          min="0"
          max={duration || 0}
          step="1"
          value={Math.min(time, duration || 0)}
          disabled={!duration || failed}
          onChange={event => seek(Number(event.target.value))}
          style={{ '--p': `${progress}%` } as CSSProperties}
          aria-label="Перемотка"
          aria-valuetext={`${formatTime(time)} из ${formatTime(duration)}`}
        />
      </div>
    </div>
  );
}
