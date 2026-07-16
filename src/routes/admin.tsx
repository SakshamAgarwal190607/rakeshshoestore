import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, CheckCircle2, XCircle, Clock, Plus, Pencil, Trash2, Upload, ShieldCheck, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/components/ProductCard";
import { SITE } from "@/lib/site";
import { resolveImageUrl } from "@/lib/product-image";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Rakesh Shoe Store" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const EMPTY = {
  product_name: "",
  brand: "",
  category: "Casual Shoes",
  size: "",
  color: "",
  original_price: "",
  clearance_price: "",
  description: "",
  condition: "New",
  status: "Available" as "Available" | "Sold",
  image_url: "" as string,
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    load();
    const ch = supabase
      .channel("admin-clearance")
      .on("postgres_changes", { event: "*", schema: "public", table: "clearance_products" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isAdmin]);

  async function load() {
    const { data } = await supabase
      .from("clearance_products")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Product[]) ?? []);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" search={{ redirect: "/admin" }} />;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-3 font-display text-2xl font-bold">Not an admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account doesn't have admin access. Sign in with the shop owner email.
        </p>
      </div>
    );
  }

  const stats = useMemo(() => {
    const list = items ?? [];
    const now = Date.now();
    return {
      total: list.length,
      available: list.filter((p) => p.status === "Available").length,
      sold: list.filter((p) => p.status === "Sold").length,
      recent: list.filter((p) => new Date(p.created_at).getTime() > now - 7 * 24 * 60 * 60 * 1000).length,
    };
  }, [items]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Admin</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Clearance Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <ProductDialog onSaved={load}>
          <Button className="btn-royal gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
        </ProductDialog>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats.total} icon={Package} tint="royal" />
        <StatCard label="Available" value={stats.available} icon={CheckCircle2} tint="success" />
        <StatCard label="Sold" value={stats.sold} icon={XCircle} tint="destructive" />
        <StatCard label="Added last 7 days" value={stats.recent} icon={Clock} tint="gold" />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3">Clearance</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((p) => (
                <AdminRow key={p.id} p={p} onChanged={load} />
              ))}
              {items && items.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No products yet — click "Add Product" to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tint }: { label: string; value: number; icon: any; tint: "royal" | "success" | "destructive" | "gold" }) {
  const bg = {
    royal: "bg-royal/10 text-royal",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/15 text-destructive",
    gold: "bg-gold/20 text-[oklch(0.4_0.1_70)] dark:text-gold",
  }[tint];
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function AdminRow({ p, onChanged }: { p: Product; onChanged: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    resolveImageUrl(p.image_url).then(setThumb);
  }, [p.image_url]);

  const toggleSold = async () => {
    const next = p.status === "Sold" ? "Available" : "Sold";
    const { error } = await supabase.from("clearance_products").update({ status: next }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${next}`);
    onChanged();
  };

  const remove = async () => {
    const { error } = await supabase.from("clearance_products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    onChanged();
  };

  return (
    <tr className="border-t">
      <td className="p-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-muted">
          {thumb ? (
            <img src={thumb} alt={p.product_name} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </td>
      <td className="p-3">
        <div className="font-medium">{p.product_name}</div>
        <div className="text-xs text-muted-foreground">{p.brand} • {p.color}</div>
      </td>
      <td className="p-3 text-muted-foreground">{p.category}</td>
      <td className="p-3">{p.size}</td>
      <td className="p-3 font-semibold">₹{Number(p.clearance_price).toLocaleString("en-IN")}</td>
      <td className="p-3">
        {p.status === "Available" ? (
          <Badge className="bg-success text-success-foreground">Available</Badge>
        ) : (
          <Badge variant="destructive">Sold</Badge>
        )}
      </td>
      <td className="p-3">
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={toggleSold}>
            {p.status === "Sold" ? "Mark Available" : "Mark Sold"}
          </Button>
          <ProductDialog product={p} onSaved={onChanged}>
            <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
          </ProductDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

function ProductDialog({ product, children, onSaved }: { product?: Product; children: React.ReactNode; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState(() =>
    product
      ? {
          product_name: product.product_name,
          brand: product.brand,
          category: product.category,
          size: product.size,
          color: product.color,
          original_price: String(product.original_price),
          clearance_price: String(product.clearance_price),
          description: product.description ?? "",
          condition: product.condition,
          status: product.status as "Available" | "Sold",
          image_url: product.image_url ?? "",
        }
      : { ...EMPTY },
  );

  useEffect(() => {
    if (!open) return;
    resolveImageUrl(form.image_url).then(setPreview);
  }, [open, form.image_url]);

  const onFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    setUploading(false);
    if (error) return toast.error(error.message);
    setForm((f) => ({ ...f, image_url: path }));
    toast.success("Image uploaded");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      product_name: form.product_name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      size: form.size.trim(),
      color: form.color.trim(),
      original_price: Number(form.original_price),
      clearance_price: Number(form.clearance_price),
      description: form.description.trim() || null,
      condition: form.condition,
      status: form.status,
      image_url: form.image_url || null,
    };
    const q = product
      ? supabase.from("clearance_products").update(payload).eq("id", product.id)
      : supabase.from("clearance_products").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(product ? "Product updated" : "Product added");
    setOpen(false);
    onSaved();
    if (!product) setForm({ ...EMPTY });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add new product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label>Product image</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-muted">
                {preview ? (
                  <img src={preview} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
              </label>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Product Name" value={form.product_name} onChange={(v) => setForm({ ...form, product_name: v })} required />
            <Field label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} required />
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SITE.categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Field label="Size" value={form.size} onChange={(v) => setForm({ ...form, size: v })} required />
            <Field label="Color" value={form.color} onChange={(v) => setForm({ ...form, color: v })} required />
            <Field label="Condition" value={form.condition} onChange={(v) => setForm({ ...form, condition: v })} />
            <Field type="number" label="Original Price (₹)" value={form.original_price} onChange={(v) => setForm({ ...form, original_price: v })} required />
            <Field type="number" label="Clearance Price (₹)" value={form.clearance_price} onChange={(v) => setForm({ ...form, clearance_price: v })} required />
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "Available" | "Sold" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy} className="btn-royal">{busy ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}
