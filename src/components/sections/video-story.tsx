export function VideoStory() {
  return (
    <section className="video-story" aria-labelledby="video-story-title">
      <div className="video-story__copy">
        <p className="eyebrow">El gesto que lo cambia todo</p>
        <h2 id="video-story-title">
          Un toque físico.
          Un modo foco real.
        </h2>
        <p className="video-story__lead">
          No hay que abrir la app, buscar un botón ni tomar una decisión larga.
          El tag NFC convierte una intención en acción en menos de un segundo.
        </p>
        <div className="video-story__points">
          <article>
            <span aria-hidden="true">01</span>
            <div>
              <h3>Sin fricción de entrada</h3>
              <p>
                Acercás el tag y el ritual empieza. Sin desbloquear el teléfono,
                sin buscar la app.
              </p>
            </div>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <div>
              <h3>Una señal concreta</h3>
              <p>
                El gesto físico le dice a tu cerebro que empezó algo diferente.
                No una notificación — una decisión.
              </p>
            </div>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <div>
              <h3>Volvés cuando elegís</h3>
              <p>
                El foco dura lo que configuraste. Sin interrupciones hasta que
                decidas terminar el ritual.
              </p>
            </div>
          </article>
        </div>
      </div>

      <div className="video-story__stage">
        <div className="video-story__glow" aria-hidden="true" />
        <div className="video-story__frame">
          <video
            aria-label="Demostración de Rituo activando el modo foco con un tag NFC"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/videos/rituo-demo.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="video-story__caption" aria-hidden="true">
          <span />
          Rituo en acción
        </div>
      </div>
    </section>
  );
}
