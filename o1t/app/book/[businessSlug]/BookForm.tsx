"use client";

import { useState } from "react";

type BookFormProps = { businessSlug: string };

export function BookForm({ businessSlug }: BookFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState<number | "">(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      setError("연락처를 입력해 주세요.");
      return;
    }
    if (!date || !time) {
      setError("날짜와 시간을 선택해 주세요.");
      return;
    }
    const dateTime = `${date}T${time}:00`;
    const peopleNum = people === "" ? undefined : Number(people);
    if (peopleNum !== undefined && (peopleNum < 1 || !Number.isInteger(peopleNum))) {
      setError("인원 수를 1 이상의 숫자로 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/book/${encodeURIComponent(businessSlug)}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          date: dateTime,
          people: peopleNum,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "예약 요청에 실패했습니다.");
        return;
      }
      setSuccess(true);
      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setPeople(1);
      setNotes("");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-medium text-green-800">예약이 접수되었습니다.</p>
        <p className="mt-2 text-sm text-green-700">
          사장님이 확인 후 연락드릴 예정입니다.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 min-touch rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          추가 예약하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="book-name" className="block text-sm font-medium text-foreground">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          id="book-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="홍길동"
          required
        />
      </div>
      <div>
        <label htmlFor="book-phone" className="block text-sm font-medium text-foreground">
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          id="book-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="010-0000-0000"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="book-date" className="block text-sm font-medium text-foreground">
            예약 날짜 <span className="text-red-500">*</span>
          </label>
          <input
            id="book-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label htmlFor="book-time" className="block text-sm font-medium text-foreground">
            예약 시간 <span className="text-red-500">*</span>
          </label>
          <input
            id="book-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="book-people" className="block text-sm font-medium text-foreground">
          인원 수
        </label>
        <input
          id="book-people"
          type="number"
          min={1}
          value={people === "" ? "" : people}
          onChange={(e) => setPeople(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label htmlFor="book-notes" className="block text-sm font-medium text-foreground">
          메모 (선택)
        </label>
        <textarea
          id="book-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="요청 사항이 있으면 적어 주세요."
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="min-touch w-full rounded-xl bg-primary py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "접수 중…" : "예약 접수하기"}
      </button>
    </form>
  );
}
