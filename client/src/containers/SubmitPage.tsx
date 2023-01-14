import { FormEventHandler, useRef } from "react";

export default function SubmitPage() {
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const send: FormEventHandler = () => {
    if (!titleRef || (!urlRef && !textRef)) {
      return;
    }
  };

  return (
    <div>
      <form className="submit-form" onSubmit={send}>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" size={50} autoFocus={true} />
        </div>
        <div className="form-control">
          <label htmlFor="url">URL</label>
          <input type="text" id="url" size={50} />
        </div>
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <textarea id="text" rows={4} cols={49} />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>
        Leave url blank to submit a question for discussion. If there is no url, text will appear at
        the top of the thread. If there is a url, text is optional.
      </p>
    </div>
  );
}
