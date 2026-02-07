import React from "react";
import { GraduationCap } from "lucide-react";
import type { Theme } from "../types";
import { education as EDUCATION } from "../data/education";
import { SectionShell } from "./shared";
import EducationTree from "./EducationTree";

export default function EducationSection({ theme }: { theme: Theme }) {
  return (
    <SectionShell id="education" title="Education" icon={<GraduationCap className="h-4 w-4" />}>
      <EducationTree nodes={EDUCATION} theme={theme} />
    </SectionShell>
  );
}
